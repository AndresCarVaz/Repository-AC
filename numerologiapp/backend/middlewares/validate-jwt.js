const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        console.log('validateJWT failed: No token provided in x-token header');
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid);

        if (!user) {
            console.log('validateJWT failed: Token valid but user does not exist in DB', uid);
            return res.status(401).json({ msg: 'Token no válido - usuario no existe' });
        }

        req.uid = uid;
        req.user = user;
        next();
    } catch (error) {
        console.log('validateJWT failed: jwt.verify threw an error', error.message);
        return res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = { validateJWT };
