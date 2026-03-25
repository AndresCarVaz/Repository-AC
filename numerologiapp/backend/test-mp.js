require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const Payment = require('./models/Payment');

async function testCreatePreference() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected');

    const User = require('./models/User');
    const user = await User.findOne();
    if (!user) {
        console.log('No users found');
        process.exit(1);
    }
    console.log('User:', user.nombre, user._id.toString());

    const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
    const pref = new Preference(client);

    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const preferenceData = {
            items: [{
                id: 'membresia-mensual',
                title: 'Membresia Mensual Numeris',
                quantity: 1,
                unit_price: 25,
                currency_id: 'ARS',
            }],
            back_urls: {
                success: `${frontendUrl}/#/pagos/exito`,
                failure: `${frontendUrl}/#/pagos/fallo`,
                pending: `${frontendUrl}/#/pagos/pendiente`,
            },
            auto_return: 'approved',
            external_reference: user._id.toString(),
        };

        console.log('Creating preference...');
        const response = await pref.create({ body: preferenceData });
        console.log('Preference created:', response.id);
        console.log('init_point:', response.init_point);
        console.log('sandbox_init_point:', response.sandbox_init_point);

        // Now test saving to DB
        const fecha_pago = new Date();
        const fecha_vencimiento = new Date(fecha_pago);
        fecha_vencimiento.setDate(fecha_vencimiento.getDate() + 30);

        const newPayment = new Payment({
            usuario_id: user._id,
            monto: 25,
            metodo: 'Mercado Pago',
            fecha_pago,
            fecha_vencimiento,
            mpPreferenceId: response.id,
            estado: 'pendiente',
        });
        await newPayment.save();
        console.log('Payment saved:', newPayment._id);

        // Clean up - delete test payment
        await Payment.findByIdAndDelete(newPayment._id);
        console.log('Test payment cleaned up');
        console.log('\n=== ALL TESTS PASSED ===');
    } catch (error) {
        console.error('\n=== ERROR ===');
        console.error('Message:', error.message);
        console.error('Name:', error.name);
        console.error('Stack:', error.stack);
        if (error.cause) console.error('Cause:', JSON.stringify(error.cause, null, 2));
    }

    await mongoose.disconnect();
}

testCreatePreference();
