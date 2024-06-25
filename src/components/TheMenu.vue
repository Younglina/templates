<script setup>
const menus = ref([
  {
    label: '首页',
    iconClass: 'i-ms-house-outline',
    path: '/',
  },
  {
    label: '系统管理',
    iconClass: 'i-ms-manage-accounts-outline',
    path: '/system',
    children: [
      {
        label: '用户管理',
        iconClass: 'i-ms-person-outline',
        path: '/user',
      },
      {
        label: '角色管理',
        iconClass: 'i-ms-user-attributes-outline',
        path: '/role',
      },
      {
        label: '部门管理',
        iconClass: 'i-ms-lan-outline',
        path: '/user1',
      },
      {
        label: 'test',
        iconClass: 'i-ms-lan-outline',
        path: '/test',
      },
    ],
  },
])
const store = useMainStore()
function handleMenuSelect(path, _, { route }) {
  store.setBreadcrumbs({ path, label: route.label })
}
</script>

<template>
  <el-menu :default-openeds="['/system']" router :default-active="$route.path" @select="handleMenuSelect">
    <submenu :menus="menus" />
  </el-menu>
</template>

<style scoped lang='scss'></style>
