<script setup>
import MainLayout from "./layouts/MainLayout.vue"
import Login from "./pages/login.vue"
</script>
<template>
  <MainLayout v-if="$route.name !== 'login'"></MainLayout>
  <Login v-else></Login>
</template>
<style lang="scss"></style>
