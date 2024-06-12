<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import MainLayout from './layouts/MainLayout.vue'
import Login from './pages/login.vue'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <MainLayout v-if="$route.name !== 'login'" />
    <Login v-else />
  </el-config-provider>
</template>

<style lang="scss"></style>
