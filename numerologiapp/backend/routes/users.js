const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');

const { getUsers, createUser, updateUser, toggleUserStatus } = require('../controllers/users');

const router = Router();

// Todas las rutas aquí están protegidas por validateJWT e isAdminRole
router.use(validateJWT);
router.use(isAdminRole);

router.get('/', getUsers);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    validateFields
], createUser);

router.put('/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    validateFields
], updateUser);

router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;
