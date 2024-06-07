<script setup>
defineProps({
  tableData: {
    type: Object,
    default: () => {
      return {
        data: [],
        columns: [],
        total: 0
      }
    }
  },
  loading: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="mb-16px">
    <el-button type="primary" plain @click="$emit('handleAdd')">
      <template #icon><i i-ms-add /></template>
      新增
    </el-button>
    <el-button type="danger" plain @click="$emit('handleDel')">
      <template #icon><i i-ms-delete-outline /></template>
      删除
    </el-button>
    <el-button type="success" plain @click="$emit('handleUpd')">
      <template #icon><i i-ms-edit-square-outline /></template>
      修改
    </el-button>
    <el-button type="warning" plain @click="$emit('handleExp')">
      <template #icon><i i-ms-arrow-circle-down-outline /></template>
      导出
    </el-button>
  </div>
  <el-table v-loading="loading" :data="tableData.data" style="width: 100%" :border="border">
    <template v-for="item in tableData.columns" :key="item.prop">
      <slot v-if="item.slot" :name="item.prop"></slot>
      <el-table-column
        v-else
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width || ''"
        :min-width="item.minWidth || ''"
      >
      </el-table-column>
    </template>
    <slot name="options"></slot>
  </el-table>
  <el-pagination
    v-if="tableData.total"
    layout="prev, pager, next"
    class="justify-end mt-12px"
    :total="tableData.total"
    @current-change="(val) => $emit('handleCurrentChange', val)"
  />
</template>

<style scoped lang="scss"></style>
