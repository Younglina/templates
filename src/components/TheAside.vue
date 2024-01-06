<script setup>
import { useStore } from '@/store'
import { routes } from '@/router'
const store = useStore()
const menus = computed(() => {
  return routes.filter(item=>item.meta.icon)
})

const showMessageBox = (v) => {
  if(['/person', 'customService'].includes(v)){
    altMsgBox(v.slice(1))
  }
}
</script>
<template>
  <el-aside class="menu-aside flex flex-col justify-between">
    <div :style="{ opacity: store.isCollapse ? '0' : '1' }">
      <div class="new-btn">+ New Chat</div>
    </div>
    <el-menu :collapse="store.isCollapse" class="aside-menu" border-r-unset :collapse-transition="false" router @select="showMessageBox">
      <el-menu-item v-for="item in menus" :key="item.name" :index="item.path" class="c-white">
        <el-icon>
          <img :src="item.meta.icon" alt="">
        </el-icon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<style scoped lang='scss'>
.menu-aside {
  background-color: #202022;
  width: 245px;
  padding: 8px;
}
.aside-menu{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.new-btn{
  border: 1px solid hsl(0deg 0% 100%/20%);
  border-radius: 5px;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  color: #fff;
  &:hover{
    transform: scale(1.05);
    cursor: pointer;
    background-color: rgb(141 141 160 / 10%);
  }
}
</style>
