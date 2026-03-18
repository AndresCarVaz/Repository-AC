<template>
  <q-page class="auth-page flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <img src="../assets/mainicon.png" alt="Logo Numerología" class="logo-icon" />
        <div class="text-h5 q-mt-sm">Numerología IA</div>
        <div class="text-subtitle2 text-grey-6 q-mt-xs">Descubre los secretos del universo numérico</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="form.email"
            type="email"
            label="Correo electrónico"
            outlined
            dense
            :rules="[val => !!val || 'El correo es requerido', val => val.includes('@') || 'Correo inválido']"
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            label="Contraseña"
            outlined
            dense
            :rules="[val => !!val || 'La contraseña es requerida']"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-icon
                :name="showPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPwd = !showPwd"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Entrar"
            color="primary"
            unelevated
            rounded
            class="mystic-btn full-width q-py-sm text-weight-bold"
            :loading="authStore.loading"
            text-color="white"
          />
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="center">
        <div class="text-caption">
          ¿No tienes cuenta?
          <q-btn flat to="/auth/registro" label="Crear cuenta" class="q-ml-xs" />
        </div>
      </q-card-actions>
    </q-card>
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
    router.push({ name: 'dashboard' });
  } else {
    $q.notify({ type: 'negative', message: result.msg });
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 24px;
}

.auth-card {
  width: min(420px, 92vw);
  max-width: 420px;
  padding: 16px;
  border-radius: 18px;
}

.logo-icon {
  display: block;
  margin: 0 auto;
  width: min(120px, 45%);
  height: auto;
  max-width: 140px;
  max-height: 140px;
  object-fit: contain;
}
</style>
