<script setup>
// import MessageBox from "@/components/MessageBox/messageBox.js";
import s from "@/utils/useTest.js";
const sp = computed(() => s.progress);
let a = 0;
setInterval(() => {
  a += 1;
  s.p.seek(a);
}, 1000);
</script>

<template>
  {{ s.p.progress }} <button @click="s.p.progress = 10">123</button>
</template>

<style scoped lang="scss"></style>
