<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
-->
<script setup>
import { useStore } from '@/store'

const store = useStore()
</script>

<template>
  <el-header flex items-center class="wy-header">
    <div class="i-material-symbols-menu cursor-pointer"></div>
    <button icon-btn @click="toggleDark()">
      <div i-material-symbols-sunny-outline dark:i-material-symbols-nightlight-outline />
    </button>
    TheHeader
  </el-header>
</template>

<style scoped lang='scss'>
.wy-header {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 6px;
}
</style>
