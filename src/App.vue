<script setup>
import MainLayout from './layouts/MainLayout.vue'
import Login from './pages/login.vue'
</script>

<template>
  <MainLayout v-if="$route.name !== 'login'" />
  <Login v-else />
</template>

<style lang="scss"></style>
