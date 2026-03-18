<template>
  <q-layout view="hHh lpR fFf" class="auth-layout">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Background Stars -->
    <div class="stars-bg">
      <div v-for="i in 50" :key="i" class="star" :style="getStarStyle(i)" />
    </div>
  </q-layout>
</template>

<script setup>
const getStarStyle = (i) => {
  const size = Math.random() * 3 + 1;
  return {
    left: `${(i * 17 + 13) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${(i * 0.3) % 1}s`,
    animationDuration: `${5 + (i % 4)}s`
  };
};
</script>

<style lang="scss" scoped>
.auth-layout {
  background: var(--color-bg);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.stars-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
  opacity: 0.4;
}
</style>
