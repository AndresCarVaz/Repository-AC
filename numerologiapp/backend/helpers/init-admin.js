const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initAdmin = async () => {
    try {
        const adminEmail = 'admin123@admin.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Creando usuario administrador por defecto...');
            const adminUser = new User({
                nombre: 'Admin 123',
                email: adminEmail,
                password: 'admin123', // Será encriptada abajo
                fecha_nacimiento: new Date('1990-01-01'),
                estado: 'activo',
                role: 'ADMIN_ROLE'
            });

            const salt = bcrypt.genSaltSync();
            adminUser.password = bcrypt.hashSync('admin123', salt);

            await adminUser.save();
            console.log('Usuario administrador creado con éxito: admin123@admin.com / admin123');
        } else {
            console.log('Usuario administrador ya existe.');
        }
    } catch (error) {
        console.error('Error al inicializar el administrador por defecto:', error);
    }
};

module.exports = {
    initAdmin
};
