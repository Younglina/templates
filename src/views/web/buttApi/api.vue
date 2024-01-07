<script setup>
import apiKeys from './apiKeys.vue'
const menus = [
  {
    path: '', text: '用户信息', children: [
      { path: '/apiKeys', text: 'API keys' },
      { path: '/api', text: '余额/充值' },
      { path: '/midjourney', text: '充值记录' },
      { path: '/draw', text: '消耗记录' },
    ]
  },
  {
    path: '', text: '对接文档', children: [
      { path: '/drawSquare', text: '快速上手' },
      { path: '/myDraw', text: '定价' },
      { path: '/drawSquare', text: 'GPT使用指南' },
      { path: '/drawSquare', text: '技术支持' },
    ]
  }
]

const components = ref({ apiKeys: shallowRef(apiKeys) })
</script>

<template>
  <div class="flex">
    <el-menu class="api-menu pr-10px" active-text-color="#6366f1">
      <el-menu-item-group v-for="item in menus" :key="item.text">
        <template #title><span>{{ item.text }}</span></template>
        <el-menu-item v-for="c in item.children" :key="c.text" :index="c.path">{{ c.text }}</el-menu-item>
      </el-menu-item-group>
    </el-menu>
    <div class="pt-60px pl-40px">
      <component :is="components['apiKeys']"></component>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.api-menu {
  width: 258px;

  .is-active {
    background-color: var(--el-color-primary-dark-1);
  }

  .el-menu-item {
    margin-left: 10px;
    border-radius: 4px;
  }
}
</style>
