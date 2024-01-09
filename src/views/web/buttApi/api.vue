<script setup>
import apiKeys from './apiKeys.vue'
import balance from './balance.vue'
import balanceHis from './balanceHis.vue'
import costHis from './costHis.vue'
import staticPage from './staticPage.vue'
const menus = [
  {
    path: '', title: '用户信息', children: [
      { path: '/apiKeys', title: 'API keys', subtitle: '您的API密钥如下所示。请勿与他人分享您的API密钥，也不要在浏览器或其他客户端代码中公开它。' },
      { path: '/balance', title: '余额/充值', subtitle: '余额（单位CNY）' },
      { path: '/balanceHis', title: '充值记录', subtitle: '您最近的10笔充值记录' },
      { path: '/costHis', title: '消耗记录', subtitle: '您最近10天的消耗记录' },
    ]
  },
  {
    path: '', title: '对接文档', children: [
      { path: '/staticPage', title: '快速上手', query: 'quick-start' },
      { path: '/staticPage', title: '定价', query: 'price' },
      { path: '/staticPage', title: 'GPT使用指南', query: 'gpt-use' },
      { path: '/staticPage', title: '技术支持', query: 'service' },
    ]
  }
]

const components = ref({ "/apiKeys": shallowRef(apiKeys), "/balance": shallowRef(balance), "/balanceHis": shallowRef(balanceHis), "/costHis": shallowRef(costHis), "/staticPage": shallowRef(staticPage) })
const isLogin = ref(true)
const currentMenu = ref(menus[0].children[0])
function handleClick(item) {
  currentMenu.value = item
}
</script>

<template>
  <div class="flex">
    <el-menu class="api-menu pr-10px pt-20px" active-text-color="#6366f1" default-active="/apiKeys">
      <el-menu-item-group v-for="item in menus" :key="item.title">
        <template #title><span>{{ item.title }}</span></template>
        <el-menu-item v-for="c in item.children" @click="handleClick(c)" :key="c.title"
          :index="c.path + (c.query || '')">{{
            c.title
          }}</el-menu-item>
      </el-menu-item-group>
    </el-menu>
    <div class="right">
      <h1>{{ currentMenu.title }}</h1>
      <component :is="currentMenu.path==='/balance'?'h2':'p'">{{ currentMenu.subtitle }}</component>
      <component v-if="isLogin" :is="components[currentMenu.path]" :query="currentMenu.query"></component>
      <not-login v-else />
    </div>
  </div>
</template>

<style scoped lang='scss'>
.api-menu {
  width: 258px;
  min-width: 258px;

  .is-active {
    background-color: var(--el-color-primary-dark-1);
  }

  .el-menu-item {
    margin-left: 10px;
    border-radius: 4px;
  }
}

.right {
  height: calc(100vh - 200px);
  overflow-y: auto;
  flex: 1;
  padding: 60px 40px;
}
</style>
