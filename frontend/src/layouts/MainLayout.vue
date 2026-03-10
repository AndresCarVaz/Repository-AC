<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- Header -->
    <q-header elevated class="header-bar">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" class="text-white" />

        <q-toolbar-title class="font-cinzel text-gradient-gold" style="font-size: 1.1rem; font-weight: 700;">
          ✨ Numerología IA
        </q-toolbar-title>

        <!-- Membership Badge -->
        <q-badge
          :color="authStore.isMemberActive ? 'positive' : 'negative'"
          class="q-mr-md"
          style="font-size: 0.75rem; padding: 5px 10px; border-radius: 20px;"
        >
          <q-icon :name="authStore.isMemberActive ? 'star' : 'star_border'" size="xs" class="q-mr-xs" />
          {{ authStore.isMemberActive ? 'Membresía Activa' : 'Sin Membresía' }}
        </q-badge>

        <q-btn flat round dense icon="logout" @click="handleLogout" class="text-white">
          <q-tooltip>Cerrar sesión</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer v-model="drawer" :width="260" :breakpoint="700" class="drawer-bg">
      <q-scroll-area class="fit">
        <!-- User Info Panel -->
        <div class="user-panel q-pa-md text-center">
          <q-avatar size="70px" class="user-avatar float-animation" style="margin-bottom: 10px;">
            <q-icon name="person" size="40px" color="white" />
          </q-avatar>
          <div class="text-white text-weight-bold" style="font-size: 1rem;">
            {{ authStore.user?.nombre }}
          </div>
          <div class="text-grey-4" style="font-size: 0.8rem;">
            {{ authStore.user?.email }}
          </div>
        </div>

        <q-separator class="q-mb-md" color="grey-8" />

        <!-- Navigation Links -->
        <q-list>
          <q-item
            v-for="nav in navItems"
            :key="nav.to"
            clickable
            :to="nav.to"
            active-class="nav-active"
            class="nav-item q-mb-xs"
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon" color="grey-4" />
            </q-item-section>
            <q-item-section class="text-grey-3">{{ nav.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const drawer = ref(false);

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Inicio' },
  { to: '/lecturas', icon: 'auto_awesome', label: 'Mis Lecturas' },
  { to: '/pagos', icon: 'payment', label: 'Pagos' }
];

const handleLogout = () => {
  $q.dialog({
    title: 'Cerrar sesión',
    message: '¿Estás seguro de que deseas cerrar sesión?',
    cancel: { flat: true, label: 'Cancelar' },
    ok: { color: 'negative', label: 'Salir' },
    dark: true
  }).onOk(() => {
    authStore.logout();
    router.push({ name: 'login' });
  });
};
</script>

<style lang="scss" scoped>
.main-layout {
  background: var(--gradient-mystic);
  min-height: 100vh;
}

.header-bar {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(108, 74, 182, 0.3);
}

.drawer-bg {
  background: rgba(15, 15, 26, 0.98) !important;
  border-right: 1px solid rgba(108, 74, 182, 0.2);
}

.user-panel {
  background: linear-gradient(135deg, rgba(108, 74, 182, 0.2), rgba(155, 89, 182, 0.1));
  border-radius: 0 0 16px 16px;
  padding-top: 30px;
  padding-bottom: 20px;
}

.user-avatar {
  background: linear-gradient(135deg, #6C4AB6, #9B59B6);
  box-shadow: 0 4px 20px rgba(108, 74, 182, 0.5);
}

.nav-item {
  border-radius: 10px;
  margin: 0 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(108, 74, 182, 0.15);
  }
}

.nav-active {
  background: rgba(108, 74, 182, 0.3) !important;
  border-left: 3px solid #6C4AB6;

  .q-icon, .q-item__section--main {
    color: #9B59B6 !important;
  }
}
</style>
