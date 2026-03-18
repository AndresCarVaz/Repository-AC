const { Router } = require('express');
const { generateMainReading, generateDailyReading, getReadings } = require('../controllers/readings');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Obtener historial de lecturas del usuario autenticado
router.get('/', validateJWT, getReadings);

// Generar lectura principal (basada en fecha de nacimiento)
router.post('/main', validateJWT, generateMainReading);

// Generar lectura diaria (basada en la fecha actual)
router.post('/daily', validateJWT, generateDailyReading);

module.exports = router;
