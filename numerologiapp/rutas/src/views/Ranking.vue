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
          🏆 MEJORES TIEMPOS
        </div>
        <div class="row justify-center">
          <div class="col-12 col-md-10">
            <q-card>
              <q-card-section v-if="store.leaderboard.length === 0">
                <div class="text-center text-grey-6 text-h6">
                  No hay registros aún. ¡Sé el primero en jugar!
                </div>
              </q-card-section>
              <q-markup-table v-else flat>
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">Jugador</th>
                    <th class="text-left">Categoría</th>
                    <th class="text-left">Dificultad</th>
                    <th class="text-left">Tiempo</th>
                    <th class="text-left">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(score, index) in store.leaderboard" :key="index">
                    <td class="text-weight-bold">{{ index + 1 }}</td>
                    <td>{{ score.name }}</td>
                    <td>{{ score.category }}</td>
                    <td>{{ difficulties[score.difficulty].name }}</td>
                    <td class="text-primary text-weight-bold">{{ score.time }}s</td>
                    <td class="text-grey-7">{{ score.date }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
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
import { store, difficulties } from '../main.js'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>