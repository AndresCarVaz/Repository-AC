import { createApp, reactive } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import { router } from "./routes/routes.js"

// Import icon libraries
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Store global para el juego
export const store = reactive({
  playerName: '',
  leaderboard: JSON.parse(localStorage.getItem('hangman_leaderboard') || '[]')
})

// Datos del juego CON PISTAS
       export const gameData = {
       Deportes: {
    facil: [
      { word: 'GOL', hint: 'Anotación en el fútbol' },
      { word: 'RED', hint: 'Divide la cancha de tenis o voleibol' },
      { word: 'BASE', hint: 'En béisbol hay cuatro de estas' },
      { word: 'TIRO', hint: 'Acción de lanzar el balón' }
    ],
      medio: [
      { word: 'FUTBOL', hint: 'El deporte más popular del mundo' },
      { word: 'BASKET', hint: 'Se juega con un aro y una pelota naranja' },
      { word: 'TENNIS', hint: 'Se juega con raqueta y pelota amarilla' },
      { word: 'NATACION', hint: 'Deporte acuático olímpico' }
    ],
    dificil: [
      { word: 'BALONCESTO', hint: 'Deporte de canasta inventado por James Naismith' },
      { word: 'ATLETISMO', hint: 'Conjunto de deportes de pista y campo' },
      { word: 'HALTEROFILIA', hint: 'Deporte de levantamiento de pesas' }
    ]
  },
  Animales: {
    facil: [
      { word: 'GATO', hint: 'Mascota felina que maúlla' },
      { word: 'PERRO', hint: 'El mejor amigo del hombre' },
      { word: 'LEON', hint: 'Rey de la selva' },
      { word: 'OSO', hint: 'Animal grande que hiberna' },
     
      
      
    ],
        medio: [
      { word: 'ELEFANTE', hint: 'El animal terrestre más grande' },
      { word: 'JIRAFA', hint: 'Animal con cuello muy largo' },
      { word: 'TIGRE', hint: 'Felino grande con rayas' },
      { word: 'CABALLO', hint: 'Animal que se usa para montar' }
    ],
    dificil: [
      { word: 'RINOCERONTE', hint: 'Animal gris con cuerno en la nariz' },
      { word: 'HIPOPOTAMO', hint: 'Animal grande que vive en ríos africanos' },
      { word: 'COCODRILO', hint: 'Reptil grande de agua con mandíbula poderosa' }
    ]
  },

  ///me faltan frutas 
  Frutas: {
    facil: [
      { word: 'UVA', hint: 'Fruta pequeña que crece en racimos' },
      { word: 'PERA', hint: 'Fruta verde o amarilla con forma de campana' },
      { word: 'KIWI', hint: 'Fruta marrón y peluda por fuera, verde por dentro' },
      { word: 'MANGO', hint: 'Fruta tropical amarilla muy dulce' }
    ],
    medio: [
      { word: 'MANZANA', hint: 'Fruta roja o verde que cayó sobre Newton' },
      { word: 'BANANA', hint: 'Fruta amarilla alargada rica en potasio' },
      { word: 'NARANJA', hint: 'Fruta cítrica del mismo nombre que su color' },
      { word: 'SANDIA', hint: 'Fruta grande, roja por dentro, verde por fuera' }
    ],
    dificil: [
      { word: 'MARACUYA', hint: 'Fruta de la pasión, ácida y aromática' },
      { word: 'MANDARINA', hint: 'Cítrico pequeño fácil de pelar' },
      { word: 'FRAMBUESA', hint: 'Fruta roja pequeña, dulce y delicada' }
    ]
  },
  Paises: {
    facil: [
      { word: 'PERU', hint: 'País de los incas y Machu Picchu' },
      { word: 'CUBA', hint: 'Isla del Caribe, capital La Habana' },
      { word: 'IRAN', hint: 'País de Medio Oriente, antigua Persia' },
      { word: 'IRAK', hint: 'País entre Irán y Arabia Saudita' }
    ],
    medio: [
      { word: 'COLOMBIA', hint: 'País sudamericano del café' },
      { word: 'ARGENTINA', hint: 'País del tango y Messi' },
      { word: 'BRASIL', hint: 'País más grande de Sudamérica' },
      { word: 'MEXICO', hint: 'País de los tacos y mariachis' }
    ],
    dificil: [
      { word: 'VENEZUELA', hint: 'País con el Salto Ángel, la cascada más alta del mundo' },
      { word: 'ALEMANIA', hint: 'País europeo de la cerveza y los autos' },
      { word: 'AUSTRALIA', hint: 'País isla con canguros y koalas' }
    ]
  }
}

export const difficulties = {
  facil: { name: 'Fácil', attempts: 8, description: 'Palabras de 4-6 letras • 8 intentos' },
  medio: { name: 'Medio', attempts: 6, description: 'Palabras de 7-9 letras • 6 intentos' },
  dificil: { name: 'Difícil', attempts: 5, description: 'Palabras de 10+ letras • 5 intentos' }
}

const app = createApp(App)

app.use(router)

app.use(Quasar, {
  plugins: {},
})

app.mount('#app')