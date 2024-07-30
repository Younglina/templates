<script setup></script>

<template>
  <TheHeader />
  <main>
    <router-view />
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
  min-width: var(--page-min-width);
}
</style>
