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
        <div class="text-h3 text-center text-white text-weight-bold q-mb-xl">
          SELECCIONA UNA CATEGORÍA
        </div>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-md-6" v-for="cat in categories" :key="cat.name">
            <q-card 
              class="cursor-pointer category-card"
              :style="`background: linear-gradient(135deg, ${cat.colors}); min-height: 200px;`"
              @click="selectCategory(cat.name)"
            >
              <q-card-section class="text-center">
                <div class="text-h1 q-mb-md">{{ cat.icon }}</div>
                <div class="text-h4 text-white text-weight-bold">{{ cat.name }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-center">© 2024 Juego del Ahorcado</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../main.js'

const router = useRouter()
const leftDrawerOpen = ref(false)

const categories = [
  { name: 'Deportes', icon: '⚽', colors: '#FF6B6B, #FFE66D' },
  { name: 'Animales', icon: '🐻', colors: '#4ECDC4, #44A08D' },
  { name: 'Frutas', icon: '🍎', colors: '#FF6B9D, #C06C84' },
  { name: 'Paises', icon: '🌍', colors: '#95E1D3, #38A3A5' }
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function selectCategory(category) {
  router.push(`/difficulty/${category}`)
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.category-card {
  transition: transform 0.3s;
}

.category-card:hover {
  transform: scale(1.05);
}
</style>