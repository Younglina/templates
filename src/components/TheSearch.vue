<script setup>
defineProps({
  searchModel: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['search', 'reset'])
const searchModelRef = ref()
function handleReset(formEl) {
  formEl.resetFields()
  emit('reset')
}
</script>

<template>
  <el-form ref="searchModelRef" :inline="true" :model="searchModel">
    <slot />
    <el-form-item>
      <el-button type="primary" @click="$emit('search')">
        <template #icon>
          <i class="i-ms-search" />
        </template>
        查询
      </el-button>
      <el-button @click="handleReset(searchModelRef)">
        <template #icon>
          <i class="i-ms-restart-alt" />
        </template>
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
