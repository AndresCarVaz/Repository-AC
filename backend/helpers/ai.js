const axios = require('axios');

/**
 * Espera un número de milisegundos.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Genera una lectura numerológica usando la API de Google Gemini.
 * Incluye retry automático en caso de rate limit (429).
 * @param {string} prompt - El prompt completo para la IA
 * @returns {Promise<string>} - El texto de la lectura generado
 */
const generateReading = async (prompt, retries = 3) => {
    const apiKey = process.env.IA_API_KEY;
    const model = process.env.IA_MODEL || 'gemini-2.0-flash';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(url, {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            });

            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('La IA no devolvió ningún contenido');
            }

            return text;
        } catch (error) {
            const status = error?.response?.status;

            if (status === 429 && attempt < retries) {
                // Leer el retryDelay que la API nos da (en segundos), o usar backoff exponencial
                const retryInfo = error?.response?.data?.error?.details;
                const retryDelaySec = retryInfo?.find(d => d.retryDelay)?.retryDelay?.replace('s', '') || (attempt * 20);
                const waitMs = (parseInt(retryDelaySec) + 2) * 1000;

                console.log(`[AI] Rate limit (429). Reintentando en ${waitMs / 1000}s... (intento ${attempt}/${retries})`);
                await sleep(waitMs);
                continue;
            }

            // Si no es 429 recuperable, relanzar el error
            throw error;
        }
    }
};

/**
 * Construye el prompt para una lectura numerológica principal.
 */
const buildMainReadingPrompt = (nombre, fechaNacimiento) => {
    const fecha = new Date(fechaNacimiento).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return `Eres un experto en numerología. Genera una lectura numerológica completa y personalizada para ${nombre}, nacido/a el ${fecha}. 
    Incluye:
    - Número de vida (camino de vida)
    - Número de destino
    - Número del alma
    - Número de personalidad
    - Interpretación general de su perfil numerológico
    - Consejo principal para su desarrollo personal
    Escribe en español, de forma cálida, inspiradora y detallada.`;
};

/**
 * Construye el prompt para una lectura numerológica diaria.
 */
const buildDailyReadingPrompt = (nombre) => {
    const hoy = new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return `Eres un experto en numerología. Genera una lectura numerológica diaria inspiradora para ${nombre} correspondiente al día de hoy, ${hoy}.
    Incluye:
    - Número del día
    - Energía predominante del día
    - Consejo práctico para aprovechar la energía del día
    - Afirmación positiva
    Escribe en español, de forma breve (máximo 3 párrafos), cálida y motivadora.`;
};

module.exports = { generateReading, buildMainReadingPrompt, buildDailyReadingPrompt };
