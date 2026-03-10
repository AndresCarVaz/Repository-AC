const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

// POST /api/auth/register
const register = async (req, res) => {
    const { nombre, email, password, fecha_nacimiento } = req.body;

    try {
        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Ya existe un usuario con ese correo' });
        }

        // Crear usuario
        const user = new User({ nombre, email, password, fecha_nacimiento });

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id);

        res.status(201).json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor, contacte al administrador' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - email' });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - password' });
        }

        // Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor, contacte al administrador' });
    }
};

// GET /api/auth/renew
const renewToken = async (req, res) => {
    const { uid, user } = req;

    // Generar nuevo JWT
    const token = await generateJWT(uid);

    res.json({
        ok: true,
        user,
        token
    });
};

module.exports = { register, login, renewToken };
