<script setup>
import { useStore } from '@/store'

const store = useStore()
</script>

<template>
  <el-header flex items-center class="wy-header">
    <div i-material-symbols-sunny-outline dark:i-material-symbols-nightlight-outline @click="toggleDark()" />
    TheHeader
  </el-header>
</template>

<style scoped lang='scss'>
.wy-header {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 6px;
}
</style>
