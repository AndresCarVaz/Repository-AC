<template>
  <!-- Imágenes las 4 de las esquinas -->
  <img src="./assets/comida1.png" class="corner corner-tl" />
  <img src="./assets/comida2.png" class="corner corner-tr" />
  <img src="./assets/comida3.png" class="corner corner-bl" />
  <img src="./assets/comida4.png" class="corner corner-br" />

  <div 
    class="area" 
    @mousemove="moverMosca" 
    @click="mostrarPeriodico"
    ref="areaRef"
    :style="{ cursor: cursorStyle }"
  >
    <!-- Mosca -->
    <img 
      :src="imagenMoscaActual"
      :class="['mosca', { 'mosca-burlandose': mostrandoBurla }]"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
    />

    <!-- Imagen del periódico al hacer clic -->
    <img 
      v-if="mostrarPeriodicoImg"
            src="./assets/periodico.png"
      class="periodico-click"
      :style="{ left: clickPos.x + 'px', top: clickPos.y + 'px' }"
    />

                  <!-- Imagen EXPLOSIÓN -->
    <img 
      v-if="mostrarExplosion"
      :src="explosion"
      class="explosion"
    />

    <!-- Sonido -->
    <audio ref="audioRef">
           <source src="./assets/moscasound.mp3" type="audio/mpeg">
    </audio>

    <!-- Botón centrado -->
    <div class="boton-central">
      <CustomButton 
        @accion="accionBoton"
              colorFondo="salmon" 
        textoColor="black" 
        nombreBoton="ya no aguanto mas 😖" 
      />
    </div>

    <!-- Modal -->
    <q-dialog v-model="mostrarModal">
      <q-card>
        <q-card-section class="text-h6 texto-modal">
          {{ textoModal }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import mosca from './assets/mosca.gif'
import moscaBurlandose from './assets/moscaburlandose.png'
import explosion from './assets/explosion.gif'
import CustomButton from './components/CustomButton.vue'
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai"

// =============================
// Configuración de Gemini
// =============================
const API_KEY = "AIzaSyBBAEYltiVyWscwACtzAbqZCysBH1lSxs0"
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

// Personalidad de la mosca
const personalidadMosca = `Eres una mosca molesta y burlona que se ríe del humano que intenta aplastarte con un periódico. 
Eres muy arrogante y te burlas de que siempre fallas al intentar atraparme. 
Responde con UNA SOLA oración corta y burlona (máximo 15 palabras). 
Usa emojis como 😂, 🪰, 💨, 😎 para ser más molesta.`

// =============================
// Estado
// =============================
const pos = ref({ x: 100, y: 100 })
const areaRef = ref(null)
const audioRef = ref(null)
const mostrarModal = ref(false)
const textoModal = ref("Botón pulsado")
const mostrarPeriodicoImg = ref(false)
const clickPos = ref({ x: 0, y: 0 })
const imagenMoscaActual = ref(mosca)
const mostrandoBurla = ref(false)
const mostrarExplosion = ref(false)
const cargandoMensaje = ref(false)
const cursorStyle = ref('crosshair')

const SPEED = 70
const IMG_SIZE = 80
let intervalo = null

// =============================
// Reproducir sonido cada 10 segundos
// =============================
onMounted(() => {
  intervalo = setInterval(() => {
    if (audioRef.value) audioRef.value.play()
  }, 10000)
})

onBeforeUnmount(() => {
  if (intervalo) clearInterval(intervalo)
})

// =============================
// Función para mover la mosca
// =============================
function moverMosca(e) {
  const rect = areaRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  const dx = pos.value.x - mouseX
  const dy = pos.value.y - mouseY
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  let newX = pos.value.x + (dx / dist) * SPEED
  let newY = pos.value.y + (dy / dist) * SPEED
  const halfSize = IMG_SIZE / 0.4
  newX = Math.max(halfSize, Math.min(rect.width - halfSize, newX))
  newY = Math.max(halfSize, Math.min(rect.height - halfSize, newY))
  pos.value = { x: newX, y: newY }
}

// =============================
// Función para obtener mensaje burlón con Gemini AI
// =============================
async function obtenerMensajeBurlon() {
  if (cargandoMensaje.value) return
  
  cargandoMensaje.value = true
  textoModal.value = "🪰 La mosca está pensando algo burlón..."
  mostrarModal.value = true
  
  try {
    const prompt = `${personalidadMosca}
    
El humano acaba de fallar intentando aplastarte con un periódico. 
Responde con UNA oración burlona y corta:`

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 50,
      }
    })

    const respuesta = result.response.text().trim()
    textoModal.value = `🪰 ${respuesta}`
    
  } catch (err) {
    console.error("Error al obtener mensaje:", err)
    // Mensajes de respaldo si falla la API


    const mensajesFallback = [
      "🪰 ¡Jajaja! ¡no da ni pena! 😂",
      "🪰 ¡mi ex me daba mas duro 💨",
      "🪰 ¿hasta petro hablando es mas rapido 😎",
      "🪰 ¡Mejor suerte la próxima vez, ah cierto q no tiens! 🤣",
      "🪰 ¡meh era para la otra izquierda ! 💨😂"
    ]
    textoModal.value = mensajesFallback[Math.floor(Math.random() * mensajesFallback.length)]
  } finally {
    cargandoMensaje.value = false
  }
}

// =============================
// Función para mostrar el periódico al hacer clic
// =============================
async function mostrarPeriodico(e) {
  const rect = areaRef.value.getBoundingClientRect()
  clickPos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  mostrarPeriodicoImg.value = true
  
  // Cambiar la mosca a burlandose
  cambiarMosca()
  
  // ✨ ACA Es para Obtener mensaje burlón de Gemini
  obtenerMensajeBurlon()
  
  // Ocultar después de 2 segundos
  setTimeout(() => {
    mostrarPeriodicoImg.value = false
  }, 2000)
}

// =============================
// Función que cambia la imagen de la mosca al hacer clic
// =============================
function cambiarMosca() {
  imagenMoscaActual.value = moscaBurlandose
  mostrandoBurla.value = true
  
  setTimeout(() => {
    imagenMoscaActual.value = mosca
    mostrandoBurla.value = false
  }, 2000)
}

// =============================
// Función EXPLOSIÓN
// =============================
function accionBoton() {
  mostrarExplosion.value = true

  setTimeout(() => {
    mostrarExplosion.value = false
  }, 2000)

  textoModal.value = `La mosca está MORIDA`
  mostrarModal.value = true
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.area {
  width: 100vw;
  height: 100vh;
  background: #4f4c33;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.mosca {
  width: 35px;
  height: 35px;
  position: absolute;
  transition: left 0.1s linear, top 0.1s linear;
  transform: translate(-50%, -50%);
  z-index: 11;
  pointer-events: none;
}

.mosca-burlandose {
  width: 175px;
  height: 175px;
}

.periodico-click {
  width: 390px;
  height: 390px;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;
  animation: golpe 0.2s ease-out;
}

@keyframes golpe {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.boton-central {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.corner {
  width: 360px;
  height: 360px;
  position: absolute;
  z-index: 10; 
  pointer-events: none;
}

.corner-tl {
  top: 10px;
  left: 10px;
}

.corner-tr {
  top: 10px;
  right: 10px;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
}

.corner-br {
  bottom: 10px;
  right: 10px;
}

/* EXPLOSIÓN */
.explosion {
  position: absolute;
  width: 500px; 
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  pointer-events: none;
}

/* MODAL */
.texto-modal {
  color: #060303; 
  font-weight: bold; 
}
</style>