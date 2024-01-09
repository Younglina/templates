<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: AI聊天
-->
<script setup>
const isShow = ref(true)
const { width } = useWindowSize()
watch(width, (v) => {
  handleShow(v)
}, { immediate: true })
function handleShow(v) {
  if (v <= 1024) {
    isShow.value = false
  } else {
    isShow.value = true
  }
}
</script>
≤
<template>
  <div class="chat-page">
    <TheAside v-model:isShow="isShow" />
    <div class="chat-content relative">
      <el-header flex items-center class="wy-header">
        <div v-if="!isShow" class="i-material-symbols-menu cursor-pointer" @click="isShow = true"></div>
      </el-header>
      <div class="absolute font-size-16px top-16px right-20px cursor-pointer" i-material-symbols-sunny-outline
        dark:i-material-symbols-nightlight-outline @click="toggleDark()" />
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
