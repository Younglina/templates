<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 10:13:57
 * @Description: api对接 路由页面
-->
<script setup>
const routes = [
  { path: '/', text: 'AI聊天' },
  { path: '/api', text: 'API对接' },
  { path: '/midjourney', text: 'MidJourney' },
  { path: '/draw', text: '普通绘画' },
  { path: '/drawSquare', text: '绘画广场' },
  { path: '/myDraw', text: '我的作品' },
  { path: '/drawSquare', text: '绘画广场' },
]
const activeIndex = ref(routes[1].path)
function handleSelect() {
  console.log(123)
}
</script>
<template>
  <div class="flex flex-col h-full">
    <el-menu :default-active="activeIndex" mode="horizontal" active-text-color="#6366f1" @select="handleSelect" router>
      <el-menu-item v-for="item in routes" :key="item.text" :index="item.path">{{ item.text }}</el-menu-item>
    </el-menu>
    <RouterView class="flex-1"></RouterView>
  </div>
</template>
<style scoped lang='scss'></style>