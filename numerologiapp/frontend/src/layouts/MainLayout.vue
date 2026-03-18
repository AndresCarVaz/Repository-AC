<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <div v-if="authStore.isLoggedIn" class="matrix-bg">
      <canvas ref="matrixCanvas"></canvas>
    </div>

    <!-- Header -->
    <q-header elevated class="header-bar">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="drawer = !drawer" class="text-white" />

        <q-toolbar-title class="font-cinzel text-white row items-center no-wrap" style="font-size: 1.1rem; font-weight: 700;">
          <img src="src/assets/mainicon.png" alt="Logo" style="height: 32px; margin-right: 12px; margin-bottom: 2px;" />
          Numerología IA
        </q-toolbar-title>

        <!-- Membership Badge -->
        <q-badge
          :style="authStore.isMemberActive 
            ? 'background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.4); color: #D4AF37; font-size: 0.75rem; border-radius: 20px; font-weight: 600;'
            : 'background: transparent; border: 1px solid rgba(239, 68, 68, 0.4); color: #EF4444; font-size: 0.75rem; border-radius: 20px; font-weight: 600;'"
          class="q-mr-md q-py-xs q-px-sm"
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const drawer = ref(false);
const matrixCanvas = ref(null);
let matrixAnimationId = null;
let cleanupMatrix = null;

const setupMatrix = () => {
  const canvas = matrixCanvas.value;
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  const letters = '0123456789';
  const fontSize = 10;
  let columns = [];

  const initColumns = () => {
    columns = Array(Math.floor(canvas.width / fontSize)).fill(0);
  };

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(180, 220, 255, 0.75)';
    ctx.font = `${fontSize}px monospace`;

    columns.forEach((y, index) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      const x = index * fontSize;
      ctx.fillText(text, x, y);

      if (y > canvas.height + Math.random() * 1000) {
        columns[index] = 0;
      } else {
        columns[index] = y + fontSize * 0.065;
      }
    });

    matrixAnimationId = requestAnimationFrame(draw);
  };

  const handleResize = () => {
    resize();
    initColumns();
  };

  window.addEventListener('resize', handleResize);
  handleResize();
  draw();

  return () => {
    window.removeEventListener('resize', handleResize);
    if (matrixAnimationId) cancelAnimationFrame(matrixAnimationId);
  };
};

onMounted(() => {
  if (authStore.isLoggedIn) {
    cleanupMatrix = setupMatrix();
  }
});

onBeforeUnmount(() => {
  if (cleanupMatrix) cleanupMatrix();
});

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
  position: relative;
  background: var(--color-bg);
  min-height: 100vh;
}

.matrix-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.matrix-bg canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.main-layout .q-header,
.main-layout .q-drawer,
.main-layout .q-page-container {
  position: relative;
  z-index: 1;
}

.header-bar {
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.drawer-bg {
  background: rgba(0, 0, 0, 0.88) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.user-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0 0 16px 16px;
  padding-top: 28px;
  padding-bottom: 18px;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: none;
}

.nav-item {
  border-radius: 12px;
  margin: 0 8px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.nav-active {
  background: rgba(255, 255, 255, 0.12) !important;
  border-left: 3px solid rgba(255, 255, 255, 0.6);

  .q-icon,
  .q-item__section--main {
    color: rgba(255, 255, 255, 0.9) !important;
  }
}

.membership-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  
  &.membership-active {
    border-color: rgba(255, 193, 7, 0.4) !important;
    background: rgba(255, 193, 7, 0.05) !important;
    box-shadow: 0 4px 16px rgba(255, 193, 7, 0.1);
  }
  &.membership-inactive {
    border-color: rgba(255, 80, 80, 0.3) !important;
    background: rgba(255, 80, 80, 0.03) !important;
    box-shadow: 0 4px 16px rgba(255, 80, 80, 0.05);
  }
}
</style>
