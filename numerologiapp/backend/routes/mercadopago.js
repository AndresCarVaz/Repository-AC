const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { crearPreferencia, recibirNotificacion, verificarPago, redirigirDesdeMP } = require('../controllers/mercadopago');

const router = Router();

// Crear preferencia de pago (requiere JWT — es el usuario quien paga)
router.post('/create-preference', validateJWT, crearPreferencia);

// Webhook — Mercado Pago lo llama directamente, NO lleva JWT
router.post('/webhook', recibirNotificacion);

// Verificar pago cuando el usuario regresa de MP (requiere JWT)
router.get('/verify-payment', validateJWT, verificarPago);

// Redirigir desde MP al frontend (sin JWT)
router.get('/redirect', redirigirDesdeMP);

module.exports = router;
