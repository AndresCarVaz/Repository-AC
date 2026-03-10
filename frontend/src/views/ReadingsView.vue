<template>
  <q-page class="readings-page q-pa-md">
    <div class="page-header text-center q-mb-xl">
      <h2 class="font-cinzel text-gradient-gold">📜 Mis Lecturas</h2>
      <p class="text-grey-4">Tu historial del universo numerológico</p>
    </div>

    <!-- Loading -->
    <div v-if="readingsStore.loading && !readingsStore.readings.length" class="text-center q-py-xl">
      <q-spinner-dots color="purple" size="50px" />
      <p class="text-grey-4 q-mt-md">Consultando el universo...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!readingsStore.readings.length" class="text-center q-py-xl">
      <div style="font-size: 4rem;" class="float-animation">🌌</div>
      <h3 class="font-cinzel text-white q-mt-md">Aún no tienes lecturas</h3>
      <p class="text-grey-4">Ve al inicio y genera tu primera lectura numerológica</p>
      <q-btn to="/" label="Ir al inicio" class="mystic-btn q-mt-md" text-color="white" />
    </div>

    <!-- Readings List -->
    <div v-else class="readings-list">
      <q-card
        v-for="reading in readingsStore.readings"
        :key="reading._id"
        class="mystic-card reading-item q-mb-md"
        flat
      >
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-badge
              :color="reading.tipo === 'principal' ? 'deep-purple' : 'amber-8'"
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
            header-class="text-purple-3"
            expand-icon-class="text-purple-3"
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
import { onMounted } from 'vue';
import { useReadingsStore } from '../store/readings';

const readingsStore = useReadingsStore();

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
  transition: all 0.3s ease;
  &:hover {
    transform: translateX(4px);
    border-color: rgba(108, 74, 182, 0.6) !important;
  }
}
</style>
