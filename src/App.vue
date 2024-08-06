<script setup></script>

<template>
  <TheHeader />
  <main>
    <router-view v-slot="{ Component }">
      <keep-alive :include="['explore', 'artist']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>

<style scoped lang="scss">
main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
}
@media (max-width: 1280px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}
</style>
