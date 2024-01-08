<script setup>
defineProps(['tableInfo', 'loading'])
</script>

<template>
  <el-table :data="tableInfo.data" v-loading="loading" style="width: 100%" :border="true">
    <el-table-column v-for="item in tableInfo.columns" :key="item.prop" :prop="item.prop" :label="item.label"
      :width="item.width || ''" />
    <slot />
  </el-table>
  <el-pagination v-if="tableInfo.total" layout="prev, pager, next" :total="tableInfo.total"
    @current-change="(val) => $emit('handleCurrentChange', val)" />
</template>

<style scoped lang='scss'></style>
