<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-icon name="sports_esports" size="sm" /> AHORCADO
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered>
      <q-list>
        <q-item-label header>Jugador: {{ store.playerName }}</q-item-label>
        <q-separator />
        <q-item clickable v-ripple to="/menu">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/ranking">
          <q-item-section avatar>
            <q-icon name="emoji_events" />
          </q-item-section>
          <q-item-section>Ranking</q-item-section>
        </q-item>
        <q-separator class="q-mt-md" />
        <q-item>
          <q-item-section>
            <q-item-label caption>Categoría</q-item-label>
            <q-item-label>{{ category }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Nivel</q-item-label>
            <q-item-label>{{ difficulties[difficulty].name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Intentos</q-item-label>
            <q-item-label class="text-negative text-weight-bold">
              {{ wrongAttempts }}/{{ maxAttempts }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="bg-gradient q-pa-lg">
        <div class="row justify-center">
          <div class="col-12 col-md-10">
            <q-card class="q-mb-lg">
              <q-card-section class="text-center">
                <svg viewBox="0 0 200 200" style="width: 300px; height: 300px; margin: 0 auto;">
                  <g v-html="renderHangman()"></g>
                </svg>
              </q-card-section>
            </q-card>

            <q-banner class="bg-yellow-2 q-mb-lg">
              <template v-slot:avatar>
                <q-icon name="lightbulb" color="yellow-8" />
              </template>
              <strong>Pista:</strong> {{ hint }}
            </q-banner>

            <div class="text-center q-mb-xl">
              <div class="text-h3 text-white text-weight-bold" style="letter-spacing: 8px;">
                {{ displayWord }}
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mb-lg justify-center">
              <div class="col-auto" v-for="letter in alphabet" :key="letter">
                <q-btn
                  :label="letter"
                  size="md"
                  :color="getLetterColor(letter)"
                  :disable="guessedLetters.includes(letter) || gameStatus !== 'playing'"
                  @click="handleGuess(letter)"
                  style="min-width: 45px;"
                />
              </div>
            </div>

            <q-dialog v-model="showWinDialog" persistent>
              <q-card style="min-width: 350px;">
                <q-card-section class="bg-positive text-white">
                  <div class="text-h4 text-center">🎉 ¡GANASTE!</div>
                </q-card-section>
                <q-card-section>
                  <div class="text-h6 text-center">La palabra era: <strong>{{ word }}</strong></div>
                  <div class="text-subtitle1 text-center text-grey-7">Tiempo: {{ elapsedTime }}s</div>
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn label="Volver al menú" color="positive" @click="goToMenu" />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-dialog v-model="showLoseDialog" persistent>
              <q-card style="min-width: 350px;">
                <q-card-section class="bg-negative text-white">
                  <div class="text-h4 text-center">😢 PERDISTE</div>
                </q-card-section>
                <q-card-section>
                  <div class="text-h6 text-center">La palabra era: <strong>{{ word }}</strong></div>
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn label="Volver al menú" color="negative" @click="goToMenu" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store, gameData, difficulties } from '../main.js'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

const category = route.params.category
const difficulty = route.params.difficulty

const word = ref('')
const guessedLetters = ref([])
const wrongAttempts = ref(0)
const maxAttempts = ref(6)
const gameStatus = ref('playing')
const startTime = ref(null)
const hint = ref('')
const showWinDialog = ref(false)
const showLoseDialog = ref(false)
const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

const displayWord = computed(() => {
  return word.value.split('').map(letter => 
    guessedLetters.value.includes(letter) ? letter : '_'
  ).join(' ')
})

const elapsedTime = computed(() => {
  return startTime.value ? Math.floor((Date.now() - startTime.value) / 1000) : 0
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function initGame() {
  // Obtener palabras con pistas
  const wordsArray = gameData[category][difficulty]
  
  // Seleccionar un objeto aleatorio {word, hint}


  const selectedItem = wordsArray[Math.floor(Math.random() * wordsArray.length)]
  
  // Asignar palabra y pista
  word.value = selectedItem.word
  hint.value = selectedItem.hint
  
  // Resetear el juego
  guessedLetters.value = []
  wrongAttempts.value = 0
  maxAttempts.value = difficulties[difficulty].attempts
  gameStatus.value = 'playing'
  startTime.value = Date.now()
  
              // Revelar letras iniciales según dificultad
          revealInitialLetters()
}

function  revealInitialLetters() {
    let numLettersToReveal = 0
  
  // Determinar cuántas letras revelar según dificultad
  switch(difficulty) {
    case 'facil':
      numLettersToReveal = 2 
      break
    case 'medio':
      numLettersToReveal = 1
      break
    case 'dificil':
      numLettersToReveal = 0 //NADA DE ASHUDA 
      break
  }
  
  // Obtener letras únicas de la palabra
  const uniqueLetters = [...new Set(word.value.split(''))]
  
  // Seleccionar letras aleatorias para revelar

  //aca tengo error********///*** */


const shuffled = uniqueLetters.sort(() => 0.5 - Math.random())
  const lettersToReveal = shuffled.slice(0, numLettersToReveal)
  
  // Agregar las letras reveladas
  guessedLetters.value = [...lettersToReveal]
}

function handleGuess(letter) {
  if (guessedLetters.value.includes(letter) || gameStatus.value !== 'playing') return

  guessedLetters.value.push(letter)

  if (!word.value.includes(letter)) {
    wrongAttempts.value++
    if (wrongAttempts.value >= maxAttempts.value) {
      gameStatus.value = 'lost'
      showLoseDialog.value = true
    }
  } else {
    const allGuessed = word.value.split('').every(l => guessedLetters.value.includes(l))
    if (allGuessed) {
      gameStatus.value = 'won'
      showWinDialog.value = true
      saveScore()
    }
  }
}

function getLetterColor(letter) {
  if (!guessedLetters.value.includes(letter)) return 'primary'
  return word.value.includes(letter) ? 'positive' : 'negative'
}

function saveScore() {
  const time = Math.floor((Date.now() - startTime.value) / 1000)
  const newScore = {
                name: store.playerName,
    category: category,
    difficulty: difficulty,
    time,
    date: new Date().toLocaleDateString()
  }
  store.leaderboard.push(newScore)
  store.leaderboard.sort((a, b) => a.time - b.time)
  store.leaderboard = store.leaderboard.slice(0, 10)
  localStorage.setItem('hangman_leaderboard', JSON.stringify(store.leaderboard))
}

function goToMenu() {
  router.push('/menu')
}
// esta es la funcion q dibuja el matacjito 


function renderHangman() {
  const parts = [
    '<line x1="20" y1="180" x2="180" y2="180" stroke="currentColor" stroke-width="4" />',
    '<line x1="60" y1="180" x2="60" y2="20" stroke="currentColor" stroke-width="4" />',
    '<line x1="60" y1="20" x2="140" y2="20" stroke="currentColor" stroke-width="4" />',
    '<line x1="140" y1="20" x2="140" y2="50" stroke="currentColor" stroke-width="2" />'
  ]

  if (wrongAttempts.value >= 1) {
    parts.push('<circle cx="140" cy="70" r="20" fill="#ff6b6b" stroke="currentColor" stroke-width="2" />')
  }
  if (wrongAttempts.value >= 2) {
    parts.push('<line x1="140" y1="90" x2="140" y2="130" stroke="currentColor" stroke-width="3" />')
  }
  if (wrongAttempts.value >= 3) {
    parts.push('<line x1="140" y1="100" x2="120" y2="120" stroke="currentColor" stroke-width="3" />')
  }
  if (wrongAttempts.value >= 4) {
    parts.push('<line x1="140" y1="100" x2="160" y2="120" stroke="currentColor" stroke-width="3" />')
  }
  if (wrongAttempts.value >= 5) {
    parts.push('<line x1="140" y1="130" x2="120" y2="160" stroke="currentColor" stroke-width="3" />')
  }
  if (wrongAttempts.value >= 6) {
    parts.push('<line x1="140" y1="130" x2="160" y2="160" stroke="currentColor" stroke-width="3" />')
  }

  return parts.join('')
}
//aca es donde cambio el color
onMounted(() => {
  initGame()
})
</script>
<style scoped>


.bg-gradient {
  background: linear-gradient(135deg, #e2e4e6 0%, #444444 100%);
  min-height: 100vh;
}
</style>