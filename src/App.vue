<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
-->
<template>
  <el-container h-full>
    <TheAside v-if="['home'].includes($route.name)" />
    <el-container direction="vertical">
      <!-- <TheHeader /> -->
      <el-main>
        <RouterView />
      </el-main>
      <TheFooter />
    </el-container>
  </el-container>
</template>
<style scoped lang='scss'>
:deep(.el-main) {
  padding: 0;
}
</style>