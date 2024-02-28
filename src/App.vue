<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
-->
<template>
  <el-container h-full>
    <el-container direction="vertical">
      <el-main>
        <RouterView />
      </el-main>
      <!-- <TheFooter /> -->
    </el-container>
  </el-container>
</template>
<style scoped lang='scss'>
:deep(.el-main) {
  padding: 0;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
}

@media (max-width: 1336px) {
  .el-main {
    padding: 64px 5vw 96px 5vw;
  }
}
</style>