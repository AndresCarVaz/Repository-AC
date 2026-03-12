<template>
  <div class="fullscreen bg-gradient flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 400px;">
      <q-card-section>
        <div class="text-h3 text-center text-weight-bold q-mb-md">🎮 AHORCADO</div>
        <div class="text-subtitle1 text-center text-grey-7 q-mb-lg">Bienvenido al juego</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="name"
          label="Ingresa tu nombre"
          outlined
          dense
          autofocus
          @keyup.enter="startGame"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="COMENZAR"
          color="primary"
          class="full-width"
          size="lg"
          @click="startGame"
          :disable="!name.trim()"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../main.js'

const router = useRouter()
const name = ref('')

function startGame() {
  if (name.value.trim()) {
    store.playerName = name.value.trim()
    router.push('/menu')
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>