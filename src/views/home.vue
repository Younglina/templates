<script setup>
useHttp.get('/api/')
</script>

<template>
  <div class="home-page">
    <div class="home-content">
      <the-header />
      home
    </div>
  </div>
</template>

<style scoped lang='scss'>
@media(min-width: 1024px) {
  .chat-content {
    padding-left: 245px;
  }
}
</style>
