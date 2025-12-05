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
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="bg-gradient q-pa-lg">
        <div class="text-h3 text-center text-white text-weight-bold q-mb-md">
          SELECCIONA EL NIVEL
        </div>
        <div class="text-h5 text-center text-white q-mb-xl">
          Categoría: {{ category }} {{ getCategoryIcon(category) }}
        </div>
        <div class="row justify-center">
          <div class="col-12 col-md-8">
            <q-card 
              v-for="(diff, key) in difficulties" 
              :key="key"
              class="q-mb-lg cursor-pointer difficulty-card"
              @click="startGame(key)"
            >
              <q-card-section>
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h4 text-weight-bold">
                      <q-icon :name="getDifficultyIcon(key)" size="md" /> {{ diff.name }}
                    </div>
                    <div class="text-subtitle1 text-grey-7">{{ diff.description }}</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="chevron_right" size="lg" color="primary" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store, difficulties } from '../main.js'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)
const category = route.params.category

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}




function getCategoryIcon(cat) {
  const icons = {
      'Deportes': '⚽',
    'Animales': '🐻',
     'Frutas': '🍎',
    'Paises': '🌍'
  }
  return icons[cat] || ''
}

function getDifficultyIcon(diff) {
  const icons = {
    'facil': 'sentiment_satisfied',
    'medio': 'sentiment_neutral',
    'dificil': 'sentiment_dissatisfied'
  }
  return icons[diff]
}

function startGame(difficulty) {
  router.push(`/game/${category}/${difficulty}`)
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.difficulty-card {
  transition: transform 0.3s;
}

.difficulty-card:hover {
  transform: scale(1.02);
}
</style>