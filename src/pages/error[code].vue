<script setup>
const route = useRoute()

</script>
<template>
  <div>
    {{ $route.params.code }}
  </div>
</template>
<style scoped lang='scss'></style>