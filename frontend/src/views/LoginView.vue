<template>
  <q-page class="auth-page flex flex-center">
    <div class="auth-container">
      <!-- Logo -->
      <div class="text-center q-mb-xl">
        <div class="logo-icon float-animation">✨</div>
        <h1 class="font-cinzel text-gradient-gold q-my-sm">Numerología IA</h1>
        <p class="text-grey-4">Descubre los secretos del universo numérico</p>
      </div>

      <!-- Login Card -->
      <q-card class="mystic-card auth-card">
        <q-card-section class="q-pa-lg">
          <div class="text-h6 font-cinzel text-white text-center q-mb-lg">
            Iniciar Sesión
          </div>

          <q-form @submit.prevent="handleLogin" class="q-gutter-md">
            <q-input
              v-model="form.email"
              type="email"
              label="Correo electrónico"
              dark
              outlined
              color="purple-4"
              label-color="grey-4"
              :rules="[val => !!val || 'El correo es requerido', val => val.includes('@') || 'Correo inválido']"
            >
              <template #prepend>
                <q-icon name="email" color="purple-4" />
              </template>
            </q-input>

            <q-input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              label="Contraseña"
              dark
              outlined
              color="purple-4"
              label-color="grey-4"
              :rules="[val => !!val || 'La contraseña es requerida']"
            >
              <template #prepend>
                <q-icon name="lock" color="purple-4" />
              </template>
              <template #append>
                <q-icon
                  :name="showPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer text-grey-4"
                  @click="showPwd = !showPwd"
                />
              </template>
            </q-input>

            <div class="q-pt-sm">
              <q-btn
                type="submit"
                label="Entrar al Portal"
                class="mystic-btn full-width"
                :loading="authStore.loading"
                size="md"
                padding="12px"
                text-color="white"
              />
            </div>
          </q-form>

          <div class="star-separator q-my-md">
            <span class="text-grey-5" style="font-size: 0.8rem;">¿No tienes cuenta?</span>
          </div>

          <q-btn
            flat
            to="/auth/registro"
            label="Crear cuenta"
            class="full-width text-purple-4"
            size="md"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const form = ref({ email: '', password: '' });
const showPwd = ref(false);

const handleLogin = async () => {
  const result = await authStore.login(form.value.email, form.value.password);
  if (result.ok) {
    $q.notify({ type: 'positive', message: '¡Bienvenido de vuelta! 🌟' });
    router.push({ name: 'dashboard' });
  } else {
    $q.notify({ type: 'negative', message: result.msg });
  }
};
</script>

<style lang="scss" scoped>
.auth-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.logo-icon {
  font-size: 4rem;
  display: block;
}

h1 {
  font-size: 2rem !important;
  margin: 0;
  letter-spacing: 2px;
}

.auth-card {
  background: rgba(15, 15, 26, 0.9) !important;
  border: 1px solid rgba(108, 74, 182, 0.4) !important;
  backdrop-filter: blur(20px);
}
</style>
