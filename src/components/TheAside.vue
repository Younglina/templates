<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 首页侧边栏
-->
<script setup>
import { useWindowSize } from '@vueuse/core'
import { useStore } from '@/store'
import { routes } from '@/router'

const props = defineProps(['isShow'])
const isShow = useVModel(props, 'isShow')
const router = useRouter()
const store = useStore()
const menus = computed(() => {
  return routes.filter(item => item.meta.icon)
})

function showMessageBox(v) {
  if (['/person', '/customService'].includes(v))
    altMsgBox(v.slice(1))
  else if (v === '/outDrawdalle')
    router.push('/api?path=drawdalle')
  else
    router.push(v)
}
</script>

<template>
  <el-aside class="menu-aside flex flex-col justify-between"
    :style="{ transform: `translateX(${isShow ? '0' : '-260px'})` }">
    <div :style="{ opacity: store.isCollapse ? '0' : '1' }">
      <div class="new-btn">
        + New Chat
      </div>
    </div>
    <div v-if="isShow"
      class="i-material-symbols-cancel-outline close-icon absolute top-10px right--30px c-black font-size-24px cursor-pointer"
      @click="isShow = false">
    </div>
    <el-menu :collapse="store.isCollapse" class="aside-menu" :collapse-transition="false" @select="showMessageBox">
      <el-menu-item v-for="item in menus" :key="item.name" :index="item.path" class="c-white">
        <el-icon>
          <img class="w-20px" :src="item.meta.icon" alt="">
        </el-icon>
        <template #title>
          {{ item.meta.title }}
        </template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped lang='scss'>
@media(min-width: 1024px) {
  .close-icon {
    display: none;
  }
}

.menu-aside {
  position: fixed;
  z-index: 1;
  overflow: visible;
  width: 245px;
  height: 100%;
  background-color: #202022;
  padding: 8px;
}

.aside-menu {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-right: unset;

  :deep(.el-menu-item) {
    color: var(--el-color-white);
  }
}

.new-btn {
  border: 1px solid hsl(0deg 0% 100%/20%);
  border-radius: 5px;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  color: #fff;

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
    background-color: rgb(141 141 160 / 10%);
  }
}
</style>
