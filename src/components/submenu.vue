<script setup>
defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div>
    <template v-for="item in menus">
      <el-sub-menu v-if="item.children && item.children.length" :key="item.path" :index="item.path">
        <template #title>
          <i :class="item.iconClass" />
          <span>{{ item.label }}</span>
        </template>
        <submenu :menus="item.children" />
      </el-sub-menu>
      <el-menu-item v-else :key="item.label" :index="item.path" :route="{ label: item.label, path: item.path }">
        <i :class="item.iconClass" />
        <span>{{ item.label }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<style scoped lang='scss'></style>
