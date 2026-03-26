<template>
  <q-page class="dashboard-page q-pa-md">
    <!-- Welcome Header -->
    <div class="welcome-section q-mb-xl text-center">
      <h2 class="font-cinzel text-white q-my-sm">
        Hola, <span class="text-gradient-gold">{{ authStore.user?.nombre }}</span>
      </h2>
      <p class="text-grey-4">Las estrellas te revelan tu camino hoy</p>
    </div>

    <!-- Quick Actions -->
    <div class="q-mb-xl">
      <h3 class="font-cinzel text-white text-center q-mb-lg">
         Lecturas Disponibles
      </h3>

      <div class="glassmoon-grid">
        <div
          class="glassmoon-card"
          :style="tiltStyles[1]"
          @mousemove="event => handleTilt(event, 1)"
          @mouseleave="() => resetTilt(1)"
          @click="handleMainReading"
        >
          <img src="/ballred.png" alt="Ball Roja" class="glassmoon-img" />
          <div class="glassmoon-info">
            <div class="info-title">Lectura Principal</div>
            <div class="info-desc">Tu perfil numerológico completo basado en tu fecha de nacimiento</div>
            <q-btn
              dense
              unelevated
              class="info-btn"
              label="Generar Lectura"
              icon="auto_awesome"
              text-color="white"
              :loading="readingsStore.loading"
              :disable="!authStore.isMemberActive"
              @click="handleMainReading"
            />
            <div v-if="!authStore.isMemberActive" class="text-grey-6 text-caption q-mt-sm">Requiere membresía activa</div>
          </div>
        </div>

        <div
          class="glassmoon-card"
          :style="tiltStyles[0]"
          @mousemove="event => handleTilt(event, 0)"
          @mouseleave="() => resetTilt(0)"
          @click="handleDailyReading"
        >
          <img src="/ball.png" alt="Ball Azul" class="glassmoon-img" />
          <div class="glassmoon-info">
            <div class="info-title">Lectura Diaria</div>
            <div class="info-desc">La energía y consejo numerológico especial para el día de hoy</div>
            <q-btn
              dense
              unelevated
              class="info-btn"
              label="Lectura de Hoy"
              icon="today"
              text-color="white"
              :loading="readingsStore.loading"
              :disable="!authStore.isMemberActive"
              @click="handleDailyReading"
            />
            <div v-if="!authStore.isMemberActive" class="text-grey-6 text-caption q-mt-sm">Requiere membresía activa</div>
          </div>
        </div>
      </div>
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

    <!-- Reading Modal -->
    <q-dialog v-model="showModal" maximized-mobile persistent>
      <q-card class="reading-modal-card">
        <q-card-section class="row items-center q-pb-none modal-header">
          <q-badge
            color="grey-5"
            class="text-capitalize modal-badge"
          >
            {{ currentReading?.tipo === 'principal' ? '🌟 Lectura Principal' : '☀️ Lectura Diaria' }}
          </q-badge>
          <q-space />
          <q-btn flat round dense icon="close" color="grey-4" v-close-popup />
        </q-card-section>

        <q-separator color="grey-8" class="q-mt-md" />

        <q-card-section class="q-pa-xl reading-body">
          <div class="reading-text text-grey-2" style="white-space: pre-wrap; line-height: 1.9;">
            {{ currentReading?.contenido }}
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cerrar" color="grey-4" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';
import { useReadingsStore } from '../store/readings';

const authStore = useAuthStore();
const readingsStore = useReadingsStore();
const $q = useQuasar();

const tiltStyles = ref([
  { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.4s ease' },
  { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.4s ease' }
]);

const showModal = ref(false);
const currentReading = ref(null);

const handleTilt = (event, index) => {
  const card = event.currentTarget;
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const maxTilt = 18;

  const rotateY = ((x - cx) / cx) * maxTilt;
  const rotateX = ((cy - y) / cy) * maxTilt;

  tiltStyles.value[index] = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`,
    transition: 'transform 0.1s ease',
  };
};

const resetTilt = (index) => {
  tiltStyles.value[index] = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    transition: 'transform 0.4s ease',
  };
};

const handleMainReading = async () => {
  $q.loading.show({ message: 'Las estrellas están generando tu lectura...' });
  const result = await readingsStore.generateMainReading();
  $q.loading.hide();
  if (result.ok) {
    currentReading.value = readingsStore.currentReading;
    showModal.value = true;
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
    currentReading.value = readingsStore.currentReading;
    showModal.value = true;
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

.glassmoon-card {
  margin: 0 auto 16px;
  width: min(240px, 40vw);
  height: min(320px, 60vw);
  max-width: 240px;
  max-height: 320px;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.07));
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    inset 0 0 30px rgba(255, 255, 255, 0.35),
    0 18px 48px rgba(18, 25, 44, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  perspective: 1000px;
}

.glassmoon-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.7), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.25), transparent 35%);
}

.glassmoon-card:hover {
  box-shadow:
    inset 0 0 35px rgba(255, 255, 255, 0.45),
    0 30px 68px rgba(18, 25, 44, 0.55);
  transform: scale3d(1.02, 1.02, 1.02);
}

.glassmoon-grid {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 18px;
  flex-wrap: wrap;
}

.glassmoon-info {
  width: 100%;
  background: rgba(20, 24, 45, 0.78);
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 0 0 20px 20px;
  padding: 14px;
  text-align: center;
}

.info-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: #f5f4ff;
  margin-bottom: 8px;
}

.info-desc {
  color: #cfd4ff;
  font-size: 0.92rem;
  line-height: 1.4;
  margin-bottom: 10px;
}

.info-btn {
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(224, 146, 255, 0.95), rgba(186, 80, 255, 0.9));
}

.glassmoon-img {
  width: 100%;
  height: 62%;
  object-fit: cover;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.35));
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

/* Modal styles */
.reading-modal-card {
  background: #0d0d1a;
  border: 1px solid rgba(108, 74, 182, 0.5);
  border-radius: 20px !important;
  max-width: 680px;
  width: 100%;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px 24px 0;
}

.modal-badge {
  font-size: 0.85rem;
  padding: 6px 14px;
  border-radius: 20px;
}

.reading-body {
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.03);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 74, 182, 0.5);
    border-radius: 10px;
  }
}

.reading-text {
  font-size: 1rem;
}
</style>
