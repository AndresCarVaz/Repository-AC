import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// =============================
// 1. Configuración del modelo Gemini
// =============================
const API_KEY = "AIzaSyBBAEYltiVyWscwACtzAbqZCysBH1lSxs0";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); // Cambiado el modelo

// =============================
// 2. Estado y datos
// =============================
// Elementos del DOM
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const clearButton = document.getElementById('clear-chat');
const autoDebateButton = document.getElementById('auto-debate');
const selectVinilosBtn = document.getElementById('select-vinilos');
const selectControladoresBtn = document.getElementById('select-controladores');
const selectedTeamDiv = document.getElementById('selected-team');
const submitButton = chatForm.querySelector('button[type="submit"]');
const customDebateButton = document.getElementById('custom-debate');
const temaSelector = document.getElementById('tema-selector');

// Estado
let equipoSeleccionado = null; // 'vinilos' o 'controladores'
let debateActivo = false;
let historialDebate = [];

// Personalidades de los DJs ()
const djs = {
  vinilos: {
    nombre: "DJ Vinyl 🎧",
    personalidad: `Eres DJ Vinyl, un purista del vinilo con mucha experiencia. 
    Defiendes la calidad del sonido analógico, la autenticidad del vinilo y la habilidad tradicional del DJ.
    Hablas de manera apasionada y bastante amargado con las nuevas generaciones. Mantén respuestas de máximo 2 o 3 oracionesy suena arrogante.`,
    avatar: "🎧"
  },
  controladores: {
    nombre: "DJ Sync 🎛️",
    personalidad: `Eres DJ Sync, un DJ moderno que ama la tecnología digital.
    Defiendes la comodidad, versatilidad y características avanzadas de los controladores digitales.
    Eres práctico y hablas de innovación. Mantén respuestas de máximo 2 oraciones.`,
    avatar: "🎛️"
  }
};

// Temas de debate automático
const temasDebate = [
  "¿El vinilo tiene mejor sonido que lo digital?",
  "Uso de controladores standalone vs tornamesas clásicas",
  "¿Software Virtual DJ es mejor que Serato?",
  "Rekordbox vs otros softwares: ventajas",
  "¿Un DJ sin laptop puede ser profesional?",
  "Autenticidad vs innovación",
  "Mantenimiento de vinilos vs comodidad digital",
  "Peso, transporte y practicidad en el equipo",
  "Costo inicial del vinilo vs controlador",
  "Efectos, loops y creatividad: software vs vinilo"
];

// =============================
// 3. Selección de equipo
// =============================
function seleccionarEquipo(equipo) {
  console.log('Equipo seleccionado:', equipo);
  equipoSeleccionado = equipo;

  // Actualizar UI
  selectVinilosBtn.classList.remove('active');
  selectControladoresBtn.classList.remove('active');

  if (equipo === 'vinilos') {
    selectVinilosBtn.classList.add('active');
    selectedTeamDiv.textContent = '🎧 Has elegido: DJ Vinyl (Vinilos)';
    selectedTeamDiv.style.color = 'orange';
  } else {
    selectControladoresBtn.classList.add('active');
    selectedTeamDiv.textContent = '🎛️ Has elegido: DJ Sync (Controladores)';
    selectedTeamDiv.style.color = 'lime';
  }

  // Habilitar input
  userInput.disabled = false;
  userInput.placeholder = '💬 Escribe tu argumento como ' + djs[equipo].nombre + '...';
  submitButton.disabled = false;
  userInput.focus();

  // Mensaje de bienvenida
  agregarMensaje(
    `¡Hola! Soy ${djs[equipo].nombre}. Proponme un tema o participa en los debates.`,
    false,
    equipo
  );
}

// =============================
// 4. Consulta a la API ()
// =============================
async function consultarDJ(contexto, tipoDJ, esUsuario = false, tema = "") {
  const dj = djs[tipoDJ];
  console.log(`Consultando a DJ: ${tipoDJ} (${dj.nombre})`);

  let promptConPersonalidad;
  if (esUsuario) {
    promptConPersonalidad = `${dj.personalidad}

El usuario dice: "${contexto}"

Como ${dj.nombre}, reformula y mejora este argumento en máximo 2 o 3 oraciones cortas:`;
  } else {
    promptConPersonalidad = `${dj.personalidad}

Tema: "${tema}"
${contexto ? `Contexto anterior: "${contexto}"` : ''}

Responde como ${dj.nombre} en máximo 2 oraciones cortas:`;
  }

  try {
    mostrarTypingIndicator(tipoDJ);
    
    // Reducir el tiempo de espera
    await new Promise(r => setTimeout(r, 2000));

    console.log("Enviando prompt a Gemini:", promptConPersonalidad);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptConPersonalidad }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 150, // Limitar tokens para respuestas cortas
      }
    });

    ocultarTypingIndicator();

    if (!result.response) {
      throw new Error("No se recibió respuesta del modelo");
    }

    const response = result.response;
    console.log("Respuesta completa de Gemini:", response);

    const texto = response.text();
    console.log("Texto extraído:", texto);

    if (!texto || texto.trim() === '') {
      throw new Error("Respuesta vacía del modelo");
    }

    let respuestaCorta = texto.trim();
    
    // Limpiar la respuesta
    respuestaCorta = respuestaCorta.replace(/^(DJ Vinyl|DJ Sync)[:\s]*/i, '');
    
    // Limitar a 2 oraciones máximo
    const oraciones = respuestaCorta.split(/[.!?]+/).filter(o => o.trim().length > 0);
    if (oraciones.length > 2) {
      respuestaCorta = oraciones.slice(0, 2).join('. ') + '.';
    }

    if (!esUsuario) {
      historialDebate.push({ rol: tipoDJ, texto: respuestaCorta });
    }

    console.log("Respuesta final:", respuestaCorta);
    return respuestaCorta;

  } catch (err) {
    console.error("Error detallado en consultarDJ:", err);
    console.error("Error stack:", err.stack);
    ocultarTypingIndicator();
    
    // Mensaje de error más específico
    if (err.message.includes('quota')) {
      return '⚠️ Límite de API alcanzado. Intenta más tarde.';
    } else if (err.message.includes('network')) {
      return '⚠️ Error de conexión. Verifica tu internet.';
    } else {
      return `⚠️ Error: ${err.message}. Intenta de nuevo.`;
    }
  }
}

// =============================
// 5. Indicadores visuales
// =============================
function mostrarTypingIndicator(tipoDJ) {
  // Remover indicador existente
  ocultarTypingIndicator();

  const typingDiv = document.createElement('div');
  typingDiv.className = 'message typing-indicator';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <span class="dj-avatar">${djs[tipoDJ].avatar}</span>
    <strong>${djs[tipoDJ].nombre}</strong> está escribiendo...
  `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function ocultarTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// =============================
// 6. Manejo de mensajes
// =============================
function agregarMensaje(texto, esUsuario = false, tipoDJ = null) {
  const div = document.createElement('div');
  div.className = 'message';

  if (esUsuario) {
    div.classList.add('user-message');
    div.innerHTML = `<span class="dj-avatar">👤</span> ${texto}`;
  } else if (tipoDJ && djs[tipoDJ]) {
    div.classList.add('dj-message', `dj-${tipoDJ}`);
    div.innerHTML = `<span class="dj-avatar">${djs[tipoDJ].avatar}</span> <strong>${djs[tipoDJ].nombre}</strong>: ${texto}`;
  } else {
    div.classList.add('ai-message');
    div.textContent = texto;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// =============================
// 7. Debate personalizado ()
// =============================
async function iniciarDebatePersonalizado() {
  if (!temaSelector.value) {
    alert('Por favor selecciona un tema primero');
    return;
  }
  if (debateActivo) return;

  const temaSeleccionado = temaSelector.value;
  debateActivo = true;
  customDebateButton.disabled = true;
  customDebateButton.textContent = '🔄 Debatiendo...';

  agregarMensaje(`🎯 Iniciando debate sobre: "${temaSeleccionado}"`, false);

  try {
    // Debate con mejor manejo de errores
    const r1 = await consultarDJ('', 'vinilos', false, temaSeleccionado);
    if (r1.includes('⚠️')) throw new Error('Error en respuesta 1');
    agregarMensaje(r1, false, 'vinilos');

    const r2 = await consultarDJ(r1, 'controladores', false, temaSeleccionado);
    if (r2.includes('⚠️')) throw new Error('Error en respuesta 2');
    agregarMensaje(r2, false, 'controladores');

    const r3 = await consultarDJ(r2, 'vinilos', false, temaSeleccionado);
    if (r3.includes('⚠️')) throw new Error('Error en respuesta 3');
    agregarMensaje(r3, false, 'vinilos');

    const r4 = await consultarDJ(r3, 'controladores', false, temaSeleccionado);
    if (r4.includes('⚠️')) throw new Error('Error en respuesta 4');
    agregarMensaje(r4, false, 'controladores');

    agregarMensaje('🏁 Debate personalizado completado!', false);
    
  } catch (err) {
    console.error("Error en debate personalizado:", err);
    agregarMensaje(`⌛ Error durante el debate. Tema: ${temaSeleccionado}`, false);
  } finally {
    debateActivo = false;
    customDebateButton.disabled = false;
    customDebateButton.textContent = '🎯 Debate por Tema';
  }
}

// =============================
// 8. Debate automático ()
// =============================
async function iniciarDebateAutomatico() {
  if (debateActivo) return;
  debateActivo = true;
  autoDebateButton.disabled = true;
  autoDebateButton.textContent = '🔄 Debate en curso...';
  historialDebate = [];

  agregarMensaje('⚡ ¡Iniciando debate automático! Los dos DJs discutirán 3 temas', false);

  // Reducir a 3 temas para evitar problemas de quota
  for (let i = 0; i < 3; i++) {
    const tema = temasDebate[i];
    agregarMensaje(`📌 Tema ${i+1}/3: ${tema}`, false);

    try {
      const r1 = await consultarDJ('', 'vinilos', false, tema);
      if (!r1.includes('⚠️')) {
        agregarMensaje(r1, false, 'vinilos');
        
        const r2 = await consultarDJ(r1, 'controladores', false, tema);
        if (!r2.includes('⚠️')) {
          agregarMensaje(r2, false, 'controladores');
        }
      }
    } catch (err) {
      console.error(`Error en tema ${i+1}:`, err);
      agregarMensaje(`⌛ Error en tema ${i+1}: ${tema}`, false);
    }
    
    // Pausa entre temas para no saturar la API
    await new Promise(r => setTimeout(r, 1000));
  }

  agregarMensaje('🏁 Debate automático completado. ¡3 temas discutidos!', false);
  debateActivo = false;
  autoDebateButton.disabled = false;
  autoDebateButton.textContent = '⚡ Debate Automático';
}

// =============================
// 9. Manejo del formulario ()
// =============================
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!equipoSeleccionado) {
    alert('Primero selecciona tu equipo');
    return;
  }

  const pregunta = userInput.value.trim();
  if (!pregunta) return;

  agregarMensaje(`[Tu mensaje]: ${pregunta}`, true);
  userInput.value = '';
  submitButton.disabled = true;

  try {
    const reformulado = await consultarDJ(pregunta, equipoSeleccionado, true);
    
    if (reformulado.includes('⚠️')) {
      agregarMensaje('⌛ Error al procesar tu mensaje. Intenta de nuevo.', false);
    } else {
      agregarMensaje(reformulado, false, equipoSeleccionado);
    }
  } catch (err) {
    console.error("Error en formulario:", err);
    agregarMensaje('⌛ Error al procesar tu mensaje.', false);
  } finally {
    submitButton.disabled = false;
    userInput.focus();
  }
});

// =============================
// 10. Listeners
// =============================
selectVinilosBtn.addEventListener('click', () => seleccionarEquipo('vinilos'));
selectControladoresBtn.addEventListener('click', () => seleccionarEquipo('controladores'));
autoDebateButton.addEventListener('click', iniciarDebateAutomatico);

clearButton.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  agregarMensaje('🎵 ¡Hola! Selecciona tu equipo arriba y empezemos el debate.', false);
  debateActivo = false;
  autoDebateButton.disabled = false;
  autoDebateButton.textContent = '⚡ Debate Automático';
  customDebateButton.disabled = false;
  customDebateButton.textContent = '🎯 Debate por Tema';
  temaSelector.value = '';
  historialDebate = [];
  equipoSeleccionado = null;
  selectVinilosBtn.classList.remove('active');
  selectControladoresBtn.classList.remove('active');
  selectedTeamDiv.textContent = 'Selecciona tu equipo primero';
  selectedTeamDiv.style.color = 'cyan';
  userInput.disabled = true;
  userInput.placeholder = '🎵 Primero selecciona tu equipo...';
  submitButton.disabled = true;
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

// =============================
// 11. Inicialización ()
// =============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando aplicación DJ Debate...');

  // Verificación de elementos críticos
  const elementos = {
    'chat-form': chatForm,
    'user-input': userInput,
    'chat-messages': chatMessages,
    'tema-selector': temaSelector,
    'custom-debate': customDebateButton,
    'auto-debate': autoDebateButton,
    'select-vinilos': selectVinilosBtn,
    'select-controladores': selectControladoresBtn
  };

  let elementosEncontrados = 0;
  for (const [nombre, elemento] of Object.entries(elementos)) {
    if (elemento) {
      console.log(`✅ ${nombre} encontrado`);
      elementosEncontrados++;
    } else {
      console.error(`❌ ${nombre} NO encontrado`);
    }
  }

  if (elementosEncontrados < Object.keys(elementos).length) {
    console.error('⚠️ Faltan elementos del DOM. Verifica el HTML.');
  }

  // Event listener para debate personalizado
  if (customDebateButton) {
    customDebateButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🎯 Iniciando debate personalizado...');
      iniciarDebatePersonalizado();
    });
  }

  // Event listener para selector de tema
  if (temaSelector) {
    temaSelector.addEventListener('change', (e) => {
      console.log('📝 Tema seleccionado:', e.target.value);
    });
  }

  console.log('✅ Inicialización completada');
});