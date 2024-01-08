<script setup>

</script>
<template>
  <div>
    <el-empty>
      <template #image>
        <div class="i-material-symbols-warning c-amber font-size-30 flex items-center"></div>
      </template>
      <template #description>
        <div class="font-size-20px">请登录后查看</div>
      </template>
      <el-button type="primary" @click="$router.push('/login')">点此登录</el-button>
    </el-empty>
  </div>
</template>
<style scoped lang='scss'></style>