const axios = require('axios');

/**
 * Espera un número de milisegundos.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Genera una lectura numerológica usando Google Gemini API nativa.
 * @param {string} prompt - El prompt completo para la IA
 * @returns {Promise<string>} - El texto de la lectura generado
 */
const generateReading = async (prompt, retries = 3) => {
    const apiKey = process.env.IA_API_KEY;
    
    if (!apiKey) {
        throw new Error('API Key de Gemini no configurada en las variables de entorno.');
    }

    // Usamos el modelo gemini-2.5-flash (el modelo por defecto para cuentas nuevas de Google AI Studio)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(url, {
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('La IA no devolvió ningún contenido.');
            }

            return text;
        } catch (error) {
            const status = error?.response?.status || 'Desconocido';
            const errorMsg = error?.response?.data?.error?.message || error.message;
            console.log(`[AI Gemini] Error en intento ${attempt}/${retries}: ${status} - ${errorMsg}`);
            
            // Si es error de rate limit (429) o cuota excedida
            if (status === 429) {
                console.log(`[AI Gemini] Rate limit (429). Esperando 5s...`);
                await sleep(5000);
                continue;
            }

            // Si llegamos al límite de reintentos lanzamos un error claro
            if (attempt === retries) {
                throw new Error(`Fallo final Gemini API: ${errorMsg}`);
            }
            
            // Reintentar ante posibles errores 5xx
            if (status !== 400 && status !== 403) {
                await sleep(2000);
            } else {
                 throw new Error(`Error Gemini: ${errorMsg}`);
            }
        }
    }

    throw new Error('No se pudo generar la lectura después de varios intentos.');
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
