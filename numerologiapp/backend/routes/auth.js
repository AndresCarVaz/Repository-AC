const { Router } = require('express');
const { check } = require('express-validator');
const { register, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Registrar usuario
router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    validateFields
], register);

// Login de usuario
router.post('/login', [
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

// Renovar token
router.get('/renew', validateJWT, renewToken);

module.exports = router;
