<template>
  <q-page class="payments-page q-pa-md">
    <div class="page-header text-center q-mb-xl">
      <h2 class="text-white">💳 Pagos y Membresía</h2>
      <p class="text-grey-4">Gestiona tu suscripción numerológica</p>
    </div>

    <!-- Membership Status Banner -->
    <q-card
      :class="['mystic-card', 'q-mb-xl', authStore.isMemberActive ? 'active-banner' : 'inactive-banner']"
      flat
    >
      <q-card-section class="row items-center">
        <q-icon
          :name="authStore.isMemberActive ? 'verified' : 'error_outline'"
          :color="authStore.isMemberActive ? 'positive' : 'warning'"
          size="40px"
          class="q-mr-md"
        />
        <div class="col">
          <div class="font-cinzel text-white text-subtitle1">
            Estado: <span :class="authStore.isMemberActive ? 'text-white' : 'text-grey-5'">
              {{ authStore.isMemberActive ? 'ACTIVO' : 'INACTIVO' }}
            </span>
          </div>
          <div class="text-grey-4 text-caption">
            {{ authStore.isMemberActive
              ? 'Tu membresía está activa. Disfruta de acceso completo a todas las lecturas.'
              : 'Registra un pago para activar tu membresía mensual.' }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Payment Form -->
    <div class="row q-gutter-lg justify-center q-mb-xl">
      <div class="col-12 col-md-5">
        <h3 class="font-cinzel text-white q-mb-md">Registrar Pago</h3>
        <q-card class="mystic-card" flat>
          <q-card-section class="q-pa-lg">
            <q-form @submit.prevent="handlePayment" class="q-gutter-md">
              <q-input
                v-model.number="paymentForm.monto"
                type="number"
                label="Monto"
                prefix="$"
                dark
                outlined
                color="grey-4"
                label-color="grey-4"
                :rules="[val => val > 0 || 'El monto debe ser mayor a 0']"
              >
                <template #prepend>
                  <q-icon name="attach_money" color="grey-4" />
                </template>
              </q-input>

              <q-select
                v-model="paymentForm.metodo"
                :options="paymentMethods"
                label="Método de pago"
                dark
                outlined
                color="grey-4"
                label-color="grey-4"
                :rules="[val => !!val || 'Selecciona un método de pago']"
              >
                <template #prepend>
                  <q-icon name="payment" color="grey-4" />
                </template>
              </q-select>

              <div class="q-pt-sm">
                <q-btn
                  type="submit"
                  label="Registrar Pago"
                  color="accent"
                  text-color="dark"
                  unelevated
                  rounded
                  class="mystic-btn full-width text-weight-bold"
                  :loading="loadingPayment"
                  size="md"
                  padding="12px"
                  icon="stars"
                />
              </div>
            </q-form>

            <q-card class="q-mt-md" flat style="background: rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 12px;">
              <div class="text-grey-4 text-caption text-center">
                <q-icon name="info" size="xs" class="q-mr-xs" />
                La membresía se activa por <strong class="text-grey-3">30 días</strong> a partir del pago
              </div>
            </q-card>
          </q-card-section>
        </q-card>
      </div>

      <!-- Payment History -->
      <div class="col-12 col-md-6">
        <h3 class="font-cinzel text-white q-mb-md">Historial de Pagos</h3>

        <div v-if="loadingHistory" class="text-center q-py-xl">
          <q-spinner-dots color="grey-4" size="40px" />
        </div>

        <div v-else-if="!payments.length" class="text-center q-py-xl">
          <div style="font-size: 3rem;" class="float-animation">💫</div>
          <p class="text-grey-5 q-mt-md">No hay pagos registrados</p>
        </div>

        <q-list v-else class="q-gutter-sm">
          <q-card
            v-for="payment in payments"
            :key="payment._id"
            class="mystic-card payment-item"
            flat
          >
            <q-card-section class="row items-center q-pa-md">
              <q-icon name="receipt" color="grey-4" size="30px" class="q-mr-md" />
              <div class="col">
                <div class="text-white text-weight-medium">${{ payment.monto }}</div>
                <div class="text-grey-5 text-caption">{{ payment.metodo }}</div>
              </div>
              <div class="text-right">
                <div class="text-grey-4 text-caption">{{ formatDate(payment.fecha_pago) }}</div>
                <div class="text-caption" :class="isExpired(payment.fecha_vencimiento) ? 'text-grey-5' : 'text-grey-4'">
                  Vence: {{ formatDate(payment.fecha_vencimiento) }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';
import api from '../services/api';

const authStore = useAuthStore();
const $q = useQuasar();

const payments = ref([]);
const loadingHistory = ref(true);
const loadingPayment = ref(false);

const paymentForm = ref({ monto: 25.00, metodo: null });
const paymentMethods = ['Tarjeta de crédito', 'Tarjeta de débito', 'PayPal', 'Transferencia bancaria', 'Mercadopago '];

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const isExpired = (dateStr) => new Date(dateStr) < new Date();

const fetchPayments = async () => {
  loadingHistory.value = true;
  try {
    const { data } = await api.get('/payments');
    payments.value = data.payments;
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Error al cargar el historial de pagos' });
  } finally {
    loadingHistory.value = false;
  }
};

const handlePayment = async () => {
  loadingPayment.value = true;
  try {
    const { data } = await api.post('/payments', paymentForm.value);
    $q.notify({ type: 'positive', message: '¡Pago registrado! Tu membresía está activa 🌟' });
    payments.value.unshift(data.payment);
    authStore.refreshUser({ ...authStore.user, estado: 'activo' });
    paymentForm.value = { monto: 25.00, metodo: null };
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.msg || 'Error al registrar el pago' });
  } finally {
    loadingPayment.value = false;
  }
};

onMounted(fetchPayments);
</script>

<style lang="scss" scoped>
.payments-page {
  max-width: 1000px;
  margin: 0 auto;
}

.active-banner {
  border-color: rgba(33, 186, 69, 0.4) !important;
  background: rgba(33, 186, 69, 0.05) !important;
}

.inactive-banner {
  border-color: rgba(242, 192, 55, 0.4) !important;
  background: rgba(242, 192, 55, 0.05) !important;
}

.payment-item {
  transition: all 0.2s ease;
  &:hover {
    transform: translateX(4px);
  }
}
</style>
