<script setup>
const router = useRouter()
function handleA() {
  router.push('/test2')
}
</script>

<template>
  <div>
    home
    <button @click="$router.push('/login')">
      login
    </button>
    <button @click="handleA">
      test
    </button>
  </div>
</template>

<style scoped lang='scss'></style>
