<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 10:13:57
 * @Description: api对接 路由页面
-->
<script setup>
const router = useRouter()
const route = useRoute()
const routes = [
  { path: '/', text: 'AI聊天' },
  { path: '/api', text: 'API对接' },
  { path: '/drawmj', text: 'MidJourney' },
  { path: '/drawdalle', text: '普通绘画' },
  { path: '/mypic', text: '我的作品' },
  { path: '/mjshowcase', text: '绘画广场' },
]
const activeIndex = ref(routes[1].path)
onMounted(() => {
  const path = route.query.path
  if (path) {
    router.push({ path: `/${path}` })
    activeIndex.value = `/${path}`
  } else {
    activeIndex.value = route.path
  }
})
function handleSelect() {
  console.log(123)
}
</script>
<template>
  <div class="flex flex-col h-full">
    <el-menu style="box-shadow: 0 2px 5px rgba(0,0,0,.15);min-height: 60px;" :default-active="activeIndex"
      mode="horizontal" active-text-color="#6366f1" @select="handleSelect" router>
      <el-menu-item v-for="item in routes" :key="item.text" :index="item.path">{{ item.text }}</el-menu-item>
    </el-menu>
    <RouterView class="flex-1"></RouterView>
  </div>
</template>
<style scoped lang='scss'></style>