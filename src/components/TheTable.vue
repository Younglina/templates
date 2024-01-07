<script setup>

</script>

<template>
  <el-table :data="$attrs.tableInfo.data" style="width: 100%" show-overflow-tooltip>
    <el-table-column
      v-for="item in $attrs.tableInfo.columns" :key="item.prop" :prop="item.prop" :label="item.label"
      :width="item.width || ''"
    />
    <slot />
  </el-table>
  <el-pagination
    layout="prev, pager, next" :total="$attrs.tableInfo.total"
    @current-change="(val) => $emit('handleCurrentChange', val)"
  />
</template>

<style scoped lang='scss'></style>
