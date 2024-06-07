<script setup>
const store = useMainStore()
const router = useRouter()
function handleClick(bc) {
  store.setBreadcrumbs(bc)
  router.push(bc.path)
}
</script>

<template>
  <div class="breadcrumb bt-1">
    <span
      v-for="bc in store.breadcrumbs"
      :key="bc.path"
      class="bread-tag is-closable"
      :class="{ current: bc.path === $route.path }"
      closable
      @click="handleClick(bc)"
    >
      <i class="current-icon" />
      <span class="bread-content">{{ bc.label }}</span>
      <i class="close-icon i-ms-close-small fw-500" @click.stop="store.delBreadcrumbs(bc)" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.breadcrumb {
  background-color: var(--el-bg-color);
  padding: 4px 16px;
  z-index: 2;

  .bread-tag {
    align-items: center;
    background-color: var(--wy-bg-color);
    border-color: var(--el-border-color);
    border-radius: 2px;
    border-style: solid;
    border-width: 1px;
    box-sizing: border-box;
    color: var(--el-text-color-primary);
    display: inline-flex;
    font-size: var(--el-font-size-extra-small);
    height: 24px;
    justify-content: center;
    line-height: 1;
    padding: 0 9px;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;
    margin-right: 6px;

    .current-icon {
      display: none;
      width: 6px;
      height: 6px;
      margin-right: 4px;
      border-radius: 50%;
      background-color: var(--el-color-primary);
    }

    .close-icon {
      border-radius: 50%;
      font-size: 14px;
      height: 14px;
      width: 14px;

      &:hover {
        background-color: var(--el-color-primary);
      }
    }
  }

  .current {
    color: var(--el-color-primary);
    background-color: var(--wy-tag-bg-color);

    .current-icon {
      display: inline-block;
    }
  }
}
</style>
