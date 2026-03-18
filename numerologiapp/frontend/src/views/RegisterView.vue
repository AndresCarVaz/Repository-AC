<template>
  <q-page class="auth-page flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <div class="logo-icon">🔮</div>
        <div class="text-h5 q-mt-sm">Crear Cuenta</div>
        <div class="text-subtitle2 text-grey-6 q-mt-xs">Únete al camino numerológico</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="handleRegister" class="q-gutter-md">
          <q-input
            v-model="form.nombre"
            label="Nombre completo"
            outlined
            dense
            :rules="[val => !!val || 'El nombre es requerido']"
          />

          <q-input
            v-model="form.email"
            type="email"
            label="Correo electrónico"
            outlined
            dense
            :rules="[val => !!val || 'Correo requerido', val => val.includes('@') || 'Correo inválido']"
          />

          <q-input
            v-model="form.fecha_nacimiento"
            type="date"
            label="Fecha de nacimiento"
            outlined
            dense
            :rules="[val => !!val || 'La fecha de nacimiento es requerida']"
          />

          <q-input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            label="Contraseña"
            outlined
            dense
            :rules="[val => !!val || 'Contraseña requerida', val => val.length >= 6 || 'Mínimo 6 caracteres']"
          >
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
            label="Crear cuenta"
            color="primary"
            unelevated
            rounded
            class="mystic-btn full-width q-py-sm text-weight-bold"
            :loading="authStore.loading"
          />
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="center">
        <div class="text-caption">
          ¿Ya tienes cuenta?
          <q-btn flat to="/auth/login" label="Iniciar sesión" class="q-ml-xs" />
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

const form = ref({ nombre: '', email: '', password: '', fecha_nacimiento: '' });
const showPwd = ref(false);

const handleRegister = async () => {
  const result = await authStore.register(
    form.value.nombre,
    form.value.email,
    form.value.password,
    form.value.fecha_nacimiento
  );
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
  font-size: 3rem;
}
</style>
