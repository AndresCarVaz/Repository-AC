const Payment = require('../models/Payment');
const User = require('../models/User');

// POST /api/payments
const createPayment = async (req, res) => {
    const { monto, metodo } = req.body;
    const usuario_id = req.uid;

    try {
        const fecha_pago = new Date();
        const fecha_vencimiento = new Date(fecha_pago);
        fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 30);

        const payment = new Payment({
            usuario_id,
            monto,
            metodo,
            fecha_pago,
            fecha_vencimiento
        });

        await payment.save();

        // Activar membresía del usuario
        await User.findByIdAndUpdate(usuario_id, { estado: 'activo' });

        res.status(201).json({
            ok: true,
            payment,
            msg: 'Pago registrado y membresía activada correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor, contacte al administrador' });
    }
};

// GET /api/payments
const getPayments = async (req, res) => {
    const usuario_id = req.uid;

    try {
        const payments = await Payment.find({ usuario_id }).sort({ fecha_pago: -1 });

        res.json({
            ok: true,
            payments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor, contacte al administrador' });
    }
};

module.exports = { createPayment, getPayments };
