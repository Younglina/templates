<script setup>
const store = useMainStore();
</script>
<template>
  <div class="footer-player">
    <ButtonIcon @click="store.showLyrics = !store.showLyrics">
      show
    </ButtonIcon>
  </div>
</template>
<style scoped lang="scss">
.footer-player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}
</style>
