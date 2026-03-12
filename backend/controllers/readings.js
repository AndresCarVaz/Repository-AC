const Reading = require('../models/Reading');
const { generateReading, buildMainReadingPrompt, buildDailyReadingPrompt } = require('../helpers/ai');

const handleAIError = (error, res) => {
    console.error('Error de IA:', error?.response?.status, error?.response?.data || error.message);

    const status = error?.response?.status;

    if (status === 429) {
        return res.status(429).json({
            ok: false,
            msg: 'Límite de peticiones a la IA alcanzado. Espera un momento e intenta de nuevo.'
        });
    }
    if (status === 403 || status === 401) {
        return res.status(500).json({
            ok: false,
            msg: 'La API Key de la IA no es válida. Verifica tu configuración en el servidor.'
        });
    }
    if (status === 404) {
        return res.status(500).json({
            ok: false,
            msg: 'Modelo de IA no encontrado. Contacta al administrador.'
        });
    }
    return res.status(500).json({
        ok: false,
        msg: 'Error al generar la lectura con la IA. Intenta de nuevo.'
    });
};

// POST /api/readings/main
const generateMainReading = async (req, res) => {
    const { user } = req;
    const force = req.query?.force === 'true';

    if (user.estado !== 'activo') {
        return res.status(403).json({
            ok: false,
            msg: 'Tu membresía no está activa. Por favor realiza un pago para acceder a las lecturas.'
        });
    }

    try {
        if (!force) {
            // Evitar llamadas innecesarias a la IA si ya existe la lectura principal
            const existing = await Reading.findOne({ usuario_id: user._id, tipo: 'principal' });
            if (existing) {
                return res.json({ ok: true, reading: existing });
            }
        }

        const prompt = buildMainReadingPrompt(user.nombre, user.fecha_nacimiento);
        const contenido = await generateReading(prompt);

        const reading = new Reading({
            usuario_id: user._id,
            tipo: 'principal',
            contenido
        });

        await reading.save();

        res.json({ ok: true, reading });
    } catch (error) {
        return handleAIError(error, res);
    }
};

// POST /api/readings/daily
const generateDailyReading = async (req, res) => {
    const { user } = req;

    if (user.estado !== 'activo') {
        return res.status(403).json({
            ok: false,
            msg: 'Tu membresía no está activa. Por favor realiza un pago para acceder a las lecturas.'
        });
    }

    try {
        // Evitar generar múltiples lecturas en el mismo día (uso de la IA limitado)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const existing = await Reading.findOne({
            usuario_id: user._id,
            tipo: 'diaria',
            fecha_generacion: { $gte: startOfDay, $lt: endOfDay }
        });

        if (existing) {
            return res.json({ ok: true, reading: existing });
        }

        const prompt = buildDailyReadingPrompt(user.nombre);
        const contenido = await generateReading(prompt);

        const reading = new Reading({
            usuario_id: user._id,
            tipo: 'diaria',
            contenido
        });

        await reading.save();

        res.json({ ok: true, reading });
    } catch (error) {
        return handleAIError(error, res);
    }
};

// GET /api/readings
const getReadings = async (req, res) => {
    const usuario_id = req.uid;

    try {
        const readings = await Reading.find({ usuario_id }).sort({ fecha_generacion: -1 });
        res.json({ ok: true, readings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor, contacte al administrador' });
    }
};

module.exports = { generateMainReading, generateDailyReading, getReadings };
