<template>
  <q-page class="readings-page q-pa-md">
    <div class="page-header text-center q-mb-xl">
        <h2 class="text-white">📜 Mis Lecturas</h2>
        
        <div v-if="readingsStore.readings.length > 0" class="row justify-center q-gutter-sm q-mt-md">
          <q-btn 
            @click="handleMainReading" 
            :loading="loadingMain"
            :disable="!authStore.isMemberActive"
            label="Lectura Principal" 
            icon="auto_awesome"
            color="accent"
            text-color="dark"
            unelevated
            rounded
            class="mystic-btn q-px-md text-weight-bold" 
          />
          <q-btn 
            @click="handleDailyReading" 
            :loading="loadingDaily"
            :disable="!authStore.isMemberActive"
            label="Lectura Diaria" 
            icon="today"
            color="primary"
            unelevated
            rounded
            class="mystic-btn q-px-md" 
          />
        </div>
    </div>

    <!-- Loading -->
    <div v-if="readingsStore.loading && !readingsStore.readings.length" class="text-center q-py-xl">
      <q-spinner-dots color="grey-4" size="50px" />
      <p class="text-grey-4 q-mt-md">Consultando el universo...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!readingsStore.readings.length" class="text-center q-py-xl">
      <div style="font-size: 4rem;" class="float-animation">🌌</div>
      <h3 class="font-cinzel text-white q-mt-md">Aún no tienes lecturas</h3>
      <p class="text-grey-4 q-mb-lg">Genera tu primera lectura numerológica ahora mismo</p>
      
      <div class="row justify-center q-gutter-md q-px-sm">
        <q-btn 
          @click="handleMainReading" 
          :loading="loadingMain"
          :disable="!authStore.isMemberActive"
          label="Generar Lectura Principal" 
          icon="auto_awesome"
          color="accent"
          text-color="dark"
          unelevated
          rounded
          class="mystic-btn q-px-lg text-weight-bold" 
        />
        <q-btn 
          @click="handleDailyReading" 
          :loading="loadingDaily"
          :disable="!authStore.isMemberActive"
          label="Generar Lectura Diaria" 
          icon="today"
          color="primary"
          unelevated
          rounded
          class="mystic-btn q-px-lg" 
        />
      </div>
      <div v-if="!authStore.isMemberActive" class="text-grey-6 text-caption q-mt-sm">Requiere membresía activa para generar lecturas</div>
    </div>

    <!-- Readings List -->
    <div v-else class="readings-list">
      <q-card
        v-for="reading in readingsStore.readings"
        :key="reading.id || reading._id"
        class="mystic-card reading-item q-mb-md"
        flat
      >
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-badge
              color="grey-5"
              class="text-capitalize q-mr-md"
              style="font-size: 0.8rem; padding: 5px 12px; border-radius: 20px;"
            >
              {{ reading.tipo === 'principal' ? '🌟 Lectura Principal' : '☀️ Lectura Diaria' }}
            </q-badge>
            <q-space />
            <span class="text-grey-5 text-caption">
              {{ formatDate(reading.fecha_generacion) }}
            </span>
          </div>

          <q-expansion-item
            icon="auto_stories"
            label="Ver lectura completa"
            header-class="text-grey-4"
            expand-icon-class="text-grey-4"
          >
            <q-card-section class="reading-content text-grey-3" style="white-space: pre-wrap; line-height: 1.8;">
              {{ reading.contenido }}
            </q-card-section>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useReadingsStore } from '../store/readings';
import { useAuthStore } from '../store/auth';

const readingsStore = useReadingsStore();
const authStore = useAuthStore();
const $q = useQuasar();

const loadingMain = ref(false);
const loadingDaily = ref(false);

const handleMainReading = async () => {
  loadingMain.value = true;
  $q.loading.show({ message: 'Las estrellas están generando tu lectura...' });
  const result = await readingsStore.generateMainReading();
  $q.loading.hide();
  loadingMain.value = false;
  
  if (result.ok) {
    $q.notify({ type: 'positive', message: '¡Tu lectura principal está lista y guardada! 🌟' });
  } else {
    $q.notify({ type: 'negative', message: result.msg });
  }
};

const handleDailyReading = async () => {
  loadingDaily.value = true;
  $q.loading.show({ message: 'El universo prepara tu mensaje del día...' });
  const result = await readingsStore.generateDailyReading();
  $q.loading.hide();
  loadingDaily.value = false;
  
  if (result.ok) {
    $q.notify({ type: 'positive', message: '¡Tu lectura diaria está lista y guardada! ☀️' });
  } else {
    $q.notify({ type: 'negative', message: result.msg });
  }
};

onMounted(() => {
  readingsStore.fetchReadings();
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style lang="scss" scoped>
.readings-page {
  max-width: 800px;
  margin: 0 auto;
}

.reading-item {
  transition: background 0.2s ease, transform 0.2s ease;
  &:hover {
    transform: translateX(2px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
}
</style>
