<template>
  <q-page class="dashboard-page q-pa-md">
    <!-- Welcome Header -->
    <div class="welcome-section q-mb-xl text-center">
      <div class="welcome-emoji float-animation">🌙</div>
      <h2 class="font-cinzel text-white q-my-sm">
        Hola, <span class="text-gradient-gold">{{ authStore.user?.nombre }}</span>
      </h2>
      <p class="text-grey-4">Las estrellas te revelan tu camino hoy</p>
    </div>

    <!-- Membership Status -->
    <div class="q-mb-xl">
      <q-card
        :class="['mystic-card', 'membership-card', authStore.isMemberActive ? 'membership-active' : 'membership-inactive']"
        flat
      >
        <q-card-section class="row items-center q-gutter-md">
          <q-icon
            :name="authStore.isMemberActive ? 'stars' : 'star_border'"
            :color="authStore.isMemberActive ? 'grey-2' : 'grey-5'"
            size="48px"
          />
          <div class="col">
            <div class="font-cinzel text-white text-h6">
              {{ authStore.isMemberActive ? 'Membresía Activa' : 'Membresía Inactiva' }}
            </div>
            <div class="text-grey-4 text-caption">
              {{ authStore.isMemberActive
                ? 'Tienes acceso completo a todas las lecturas numerológicas'
                : 'Activa tu membresía para acceder a las lecturas del universo' }}
            </div>
          </div>
          <q-btn
            v-if="!authStore.isMemberActive"
            to="/pagos"
            label="Activar"
            class="gold-btn"
            size="sm"
            padding="8px 20px"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- Quick Actions -->
    <div class="q-mb-xl">
      <h3 class="font-cinzel text-white text-center q-mb-lg">
        ✨ Lecturas Disponibles
      </h3>

      <div class="row q-gutter-md justify-center">
        <!-- Main Reading Card -->
        <div class="col-12 col-sm-5">
          <q-card class="mystic-card reading-type-card" flat>
            <q-card-section class="text-center q-pa-xl">
              <div style="font-size: 3rem; margin-bottom: 16px;">🌟</div>
              <div class="font-cinzel text-white text-h6 q-mb-sm">Lectura Principal</div>
              <p class="text-grey-4 text-caption q-mb-lg">
                Tu perfil numerológico completo basado en tu fecha de nacimiento
              </p>
              <q-btn
                class="mystic-btn full-width"
                label="Generar Lectura"
                icon="auto_awesome"
                text-color="white"
                :loading="readingsStore.loading"
                :disable="!authStore.isMemberActive"
                @click="handleMainReading"
              />
              <div v-if="!authStore.isMemberActive" class="text-grey-6 text-caption q-mt-sm">
                Requiere membresía activa
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Daily Reading Card -->
        <div class="col-12 col-sm-5">
          <q-card class="mystic-card reading-type-card" flat>
            <q-card-section class="text-center q-pa-xl">
              <div style="font-size: 3rem; margin-bottom: 16px;">☀️</div>
              <div class="font-cinzel text-white text-h6 q-mb-sm">Lectura Diaria</div>
              <p class="text-grey-4 text-caption q-mb-lg">
                La energía y consejo numerológico especial para el día de hoy
              </p>
              <q-btn
                class="gold-btn full-width"
                label="Lectura de Hoy"
                icon="today"
                :loading="readingsStore.loading"
                :disable="!authStore.isMemberActive"
                @click="handleDailyReading"
              />
              <div v-if="!authStore.isMemberActive" class="text-grey-6 text-caption q-mt-sm">
                Requiere membresía activa
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Current Reading Result -->
    <transition name="slide-up">
      <div v-if="readingsStore.currentReading" class="q-mb-xl">
        <h3 class="font-cinzel text-white text-center q-mb-lg">
          🔮 Tu Lectura
        </h3>
        <q-card class="mystic-card reading-result-card" flat>
          <q-card-section class="q-pa-xl">
            <div class="row justify-between items-center q-mb-md">
              <q-badge
                color="grey-5"
                class="text-capitalize"
                style="font-size: 0.8rem; padding: 5px 12px; border-radius: 20px;"
              >
                {{ readingsStore.currentReading.tipo === 'principal' ? '🌟 Lectura Principal' : '☀️ Lectura Diaria' }}
              </q-badge>
              <q-btn flat round dense icon="close" color="grey-5" @click="readingsStore.clearCurrentReading()" />
            </div>
            <div class="reading-text text-grey-2" style="white-space: pre-wrap; line-height: 1.8;">
              {{ readingsStore.currentReading.contenido }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </transition>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';
import { useReadingsStore } from '../store/readings';

const authStore = useAuthStore();
const readingsStore = useReadingsStore();
const $q = useQuasar();

const handleMainReading = async () => {
  $q.loading.show({ message: 'Las estrellas están generando tu lectura...' });
  const result = await readingsStore.generateMainReading();
  $q.loading.hide();
  if (result.ok) {
    $q.notify({ type: 'positive', message: '¡Tu lectura principal está lista! 🌟' });
  } else {
    $q.notify({ type: 'negative', message: result.msg });
  }
};

const handleDailyReading = async () => {
  $q.loading.show({ message: 'El universo prepara tu mensaje del día...' });
  const result = await readingsStore.generateDailyReading();
  $q.loading.hide();
  if (result.ok) {
    $q.notify({ type: 'positive', message: '¡Tu lectura diaria está lista! ☀️' });
  } else {
    $q.notify({ type: 'negative', message: result.msg });
  }
};
</script>

<style lang="scss" scoped>
.dashboard-page {
  max-width: 900px;
  margin: 0 auto;
}

.welcome-emoji {
  font-size: 3.5rem;
  display: block;
}

.membership-card {
  &.membership-active {
    border-color: rgba(255, 193, 7, 0.4) !important;
    background: rgba(255, 193, 7, 0.05) !important;
  }
  &.membership-inactive {
    border-color: rgba(255, 80, 80, 0.3) !important;
    background: rgba(255, 80, 80, 0.03) !important;
  }
}

.reading-type-card {
  height: 100%;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(108, 74, 182, 0.4) !important;
  }
}

.reading-result-card {
  background: rgba(108, 74, 182, 0.08) !important;
  border-color: rgba(108, 74, 182, 0.4) !important;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
}
</style>
