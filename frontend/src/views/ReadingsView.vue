<template>
  <q-page class="readings-page q-pa-md">
    <div class="page-header text-center q-mb-xl">
        <h2 class="text-white">📜 Mis Lecturas</h2>
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
  transition: background 0.2s ease, transform 0.2s ease;
  &:hover {
    transform: translateX(2px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
}
</style>
