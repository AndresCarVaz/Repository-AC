<template>
  <q-page class="result-page flex flex-center">
    <div class="result-card text-center q-pa-xl">

      <!-- Éxito -->
      <template v-if="status === 'approved'">
        <div class="result-icon success-icon">✅</div>
        <h2 class="font-cinzel text-white q-mt-md">¡Pago Aprobado!</h2>
        <p class="text-grey-4 q-mt-sm">Tu membresía Numeris ha sido activada por 30 días.</p>
        <p class="text-grey-5 text-caption q-mb-lg">ID de pago: {{ paymentId || '—' }}</p>
      </template>

      <!-- Pendiente -->
      <template v-else-if="status === 'pending'">
        <div class="result-icon pending-icon">⏳</div>
        <h2 class="font-cinzel text-white q-mt-md">Pago Pendiente</h2>
        <p class="text-grey-4 q-mt-sm">Tu pago está siendo procesado. Recibirás una confirmación pronto.</p>
        <p class="text-grey-5 text-caption q-mb-lg">Puedes cerrar esta página y revisar más tarde.</p>
      </template>

      <!-- Fallo / Rechazado -->
      <template v-else>
        <div class="result-icon failure-icon">❌</div>
        <h2 class="font-cinzel text-white q-mt-md">Pago No Completado</h2>
        <p class="text-grey-4 q-mt-sm">El pago fue rechazado o cancelado. Puedes intentarlo nuevamente.</p>
        <p class="text-grey-5 text-caption q-mb-lg">Si el problema persiste, intenta con otro método de pago.</p>
      </template>

      <q-btn
        label="Volver a Pagos"
        color="accent"
        text-color="dark"
        unelevated
        rounded
        class="mystic-btn q-mt-md"
        icon="arrow_back"
        :to="{ name: 'payments' }"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';
import { verificarPago } from '../services/mercadopago';

const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

const status = ref(route.query.status || 'failure');
const paymentId = ref(route.query.payment_id || null);
const loading = ref(true);

onMounted(async () => {
  try {
    const params = {
      payment_id: paymentId.value,
      status: status.value,
      external_reference: route.query.external_reference,
    };

    const data = await verificarPago(params);
    status.value = data.status;

    // Si fue aprobado, refrescar el estado del usuario en el store
    if (data.status === 'approved') {
      authStore.refreshUser({ ...authStore.user, estado: 'activo' });
      $q.notify({ type: 'positive', message: '¡Membresía activada! Disfruta Numeris 🌟' });
    }
  } catch (err) {
    // Si falla la verificación, mantenemos el status de la URL
    console.error('Error verificando pago:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
}

.result-card {
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.result-icon {
  font-size: 5rem;
  animation: pop-in 0.5s ease;
}

.success-icon { filter: drop-shadow(0 0 20px rgba(33, 186, 69, 0.6)); }
.pending-icon  { filter: drop-shadow(0 0 20px rgba(242, 192, 55, 0.6)); }
.failure-icon  { filter: drop-shadow(0 0 20px rgba(200, 60, 60, 0.6)); }

@keyframes pop-in {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>
