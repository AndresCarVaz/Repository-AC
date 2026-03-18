const { Router } = require('express');
const { check } = require('express-validator');
const { createPayment, getPayments } = require('../controllers/payments');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

// Obtener historial de pagos del usuario autenticado
router.get('/', validateJWT, getPayments);

// Registrar un nuevo pago
router.post('/', [
    validateJWT,
    check('monto', 'El monto es obligatorio y debe ser un número').isNumeric(),
    check('metodo', 'El método de pago es obligatorio').not().isEmpty(),
    validateFields
], createPayment);

module.exports = router;
