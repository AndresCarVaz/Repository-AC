const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Obtener usuarios con sus pagos
const getUsers = async (req, res) => {
    try {
        const [users, payments] = await Promise.all([
            User.find(),
            Payment.find().sort({ fecha_pago: -1 })
        ]);

        const usersWithPayments = users.map(user => {
            const userObj = user.toJSON();
            userObj.pagos = payments.filter(p => p.usuario_id.toString() === user._id.toString());
            return userObj;
        });

        res.json({
            ok: true,
            users: usersWithPayments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
};

// Crear usuario (Admin)
const createUser = async (req, res) => {
    const { nombre, email, password, fecha_nacimiento, role, estado } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        const user = new User({ nombre, email, password, fecha_nacimiento, role, estado });

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        res.status(201).json({
            ok: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al crear usuario' });
    }
};

// Actualizar usuario (Admin)
const updateUser = async (req, res) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({ msg: 'No existe un usuario por ese ID' });
        }

        const { password, email, ...campos } = req.body;

        if (userDB.email !== email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: 'Ya existe un usuario con ese email' });
            }
        }

        campos.email = email;

        if (password) {
            const salt = bcrypt.genSaltSync();
            campos.password = bcrypt.hashSync(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
};

// Activar / Desactivar usuario (Admin)
const toggleUserStatus = async (req, res) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({ msg: 'No existe un usuario por ese ID' });
        }

        const nuevoEstado = userDB.estado === 'activo' ? 'inactivo' : 'activo';
        const updatedUser = await User.findByIdAndUpdate(uid, { estado: nuevoEstado }, { new: true });

        res.json({
            ok: true,
            msg: `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`,
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al cambiar estado del usuario' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    toggleUserStatus
};
