<template>
  <el-container h-full>
    <TheAside v-if="!['joinVIP'].includes($route.name)"/>
    <el-container direction="vertical">
      <TheHeader />
      <el-main>
        <RouterView />
      </el-main>
      <TheFooter />
    </el-container>
  </el-container>
</template>
