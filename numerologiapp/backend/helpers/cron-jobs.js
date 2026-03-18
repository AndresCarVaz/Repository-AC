const cron = require('node-cron');
const User = require('../models/User');
const Payment = require('../models/Payment');

const initCronJobs = () => {
    // Se ejecuta a las 00:00 todos los días
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Ejecutando revisión de membresías (Cron Job)...');
            const currentDate = new Date();
            
            // Buscar pagos vencidos donde el usuario siga activo
            // Nota: Podría ser más eficiente buscar los usuarios, pero esta es una forma simple
            const expiredPayments = await Payment.find({
                fecha_vencimiento: { $lt: currentDate }
            }).populate('usuario_id');

            for (const payment of expiredPayments) {
                if (payment.usuario_id && payment.usuario_id.estado === 'activo') {
                    payment.usuario_id.estado = 'inactivo';
                    await payment.usuario_id.save();
                    console.log(`Usuario ${payment.usuario_id.email} desactivado por membresía vencida.`);
                }
            }
        } catch (error) {
            console.error('Error en cron job de membresías:', error);
        }
    });
};

module.exports = {
    initCronJobs
};
