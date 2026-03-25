const Payment = require('../models/Payment');
const User = require('../models/User');
const { getPreference, getPayment } = require('../config/mercadopago');

// POST /api/mercadopago/create-preference
const crearPreferencia = async (req, res) => {
    const usuario_id = req.uid;
    const { monto = 25 } = req.body;

    let preferenceData = null;
    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        preferenceData = {
            items: [
                {
                    id: 'membresia-mensual',
                    title: 'Membresía Mensual Numeris',
                    quantity: 1,
                    unit_price: Number(monto),
                    currency_id: 'COP',
                }
            ],
            back_urls: {
                success: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/mercadopago/redirect?type=exito`,
                failure: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/mercadopago/redirect?type=fallo`,
                pending: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/mercadopago/redirect?type=pendiente`,
            },

           
            external_reference: usuario_id.toString(),
        };

        // Solo agregar notification_url si existe la variable de entorno
        if (process.env.WEBHOOK_URL) {
            preferenceData.notification_url = process.env.WEBHOOK_URL;
        }

        const response = await getPreference().create({ body: preferenceData });

        // Calcular fecha de vencimiento (30 días desde hoy)
        const fecha_pago = new Date();
        const fecha_vencimiento = new Date(fecha_pago);
        fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 30);

        // Guardar pago pendiente en BD
        const newPayment = new Payment({
            usuario_id,
            monto,
            metodo: 'Mercado Pago',
            fecha_pago,
            fecha_vencimiento,
            mpPreferenceId: response.id,
            estado: 'pendiente',
        });
        await newPayment.save();

        res.json({
            ok: true,
            preference_id: response.id,
            init_point: response.init_point,          // Producción
            sandbox_init_point: response.sandbox_init_point, // Pruebas
        });

    } catch (error) {
        console.error('Error creando preferencia MP:', error.message || error);
        res.status(500).json({ ok: false, msg: 'Error al crear preferencia de pago' });
    }

};

// POST /api/mercadopago/webhook  — llamado por Mercado Pago automáticamente
const recibirNotificacion = async (req, res) => {
    const { type, data } = req.body;

    // Responder rápido a MP para evitar reintentos
    res.sendStatus(200);

    try {
        if (type === 'payment' && data?.id) {
            const pagoInfo = await getPayment().get({ id: data.id });

            if (pagoInfo.status === 'approved') {
                const externalRef = pagoInfo.external_reference;

                // Buscar el pago pendiente más reciente de este usuario
                const pago = await Payment.findOne({
                    usuario_id: externalRef,
                    estado: 'pendiente',
                    metodo: 'Mercado Pago',
                }).sort({ fecha_pago: -1 });

                if (pago) {
                    pago.mpPaymentId = String(pagoInfo.id);
                    pago.estado = 'aprobado';
                    await pago.save();

                    // Activar membresía del usuario
                    await User.findByIdAndUpdate(externalRef, { estado: 'activo' });
                }
            }
        }
    } catch (err) {
        console.error('Error procesando webhook:', err);
    }
};

// GET /api/mercadopago/verify-payment?payment_id=...&status=...&external_reference=...
const verificarPago = async (req, res) => {
    const { payment_id, status, external_reference } = req.query;
    const usuario_id = req.uid;

    try {
        // Si no viene payment_id, devolver el status de la URL directamente
        if (!payment_id || payment_id === 'null') {
            return res.json({ ok: true, status: status || 'pending', msg: 'Sin payment_id de MP' });
        }

        const pagoInfo = await getPayment().get({ id: payment_id });
        const mpStatus = pagoInfo.status; // 'approved', 'rejected', 'pending', etc.

        // Buscar pago en BD y actualizar
        const pago = await Payment.findOne({
            usuario_id,
            metodo: 'Mercado Pago',
            estado: { $in: ['pendiente', 'aprobado'] },
        }).sort({ fecha_pago: -1 });

        if (pago && mpStatus === 'approved' && pago.estado !== 'aprobado') {
            pago.mpPaymentId = String(pagoInfo.id);
            pago.estado = 'aprobado';
            await pago.save();

            // Activar membresía
            await User.findByIdAndUpdate(usuario_id, { estado: 'activo' });
        } else if (pago && mpStatus === 'rejected') {
            pago.estado = 'rechazado';
            await pago.save();
        }

        res.json({ ok: true, status: mpStatus, payment: pago });

    } catch (error) {
        console.error('Error verificando pago MP:', error);
        res.status(500).json({ ok: false, msg: 'Error al verificar el pago' });
    }
};
// GET /api/mercadopago/redirect — Redirige desde MP al frontend (hash-based router)
const redirigirDesdeMP = (req, res) => {
    const { type } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

    // Reconstruir query params de MP (payment_id, status, etc.)
    const queryParams = new URLSearchParams(req.query);
    queryParams.delete('type'); // No necesitamos el type en la query del frontend

    const routeMap = {
        exito: 'pagos/exito',
        fallo: 'pagos/fallo',
        pendiente: 'pagos/pendiente',
    };

    const route = routeMap[type] || 'pagos/fallo';
    const qs = queryParams.toString();
    const redirectUrl = `${frontendUrl}/#/${route}${qs ? '?' + qs : ''}`;

    res.redirect(redirectUrl);
};

module.exports = { crearPreferencia, recibirNotificacion, verificarPago, redirigirDesdeMP };
