import { createRouter, createWebHashHistory } from 'vue-router'
import NameInput from '../views/NameInput.vue'
import MainMenu from '../views/MainMenu.vue'
import DifficultySelect from '../views/DifficultySelect.vue'
import Game from '../views/Game.vue'
import Ranking from '../views/Ranking.vue'
import { store } from '../main.js'

const routes = [
  { 
    path: '/', 
    name: 'NameInput',
    component: NameInput 
  },
  { 
    path: '/menu', 
    name: 'MainMenu',
    component: MainMenu,
    beforeEnter: (to, from, next) => {
      if (!store.playerName) {
        next('/')
      } else {
        next()
      }
    }
  },
  { 
    path: '/difficulty/:category', 
    name: 'DifficultySelect',
    component: DifficultySelect 
  },
  { 
    path: '/game/:category/:difficulty', 
    name: 'Game',
    component: Game 
  },
  { 
    path: '/ranking', 
    name: 'Ranking',
    component: Ranking 
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})