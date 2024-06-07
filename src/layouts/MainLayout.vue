<script setup>
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <TheMenu></TheMenu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header>
          <div i-ms-sunny-outline dark:i-ms-nightlight-outline @click="toggleDark()" />
        </el-header>
        <TheBread />
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.common-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--wy-bg-color);

  .el-menu {
    border-right: none;
    padding: 0;
  }

  .el-aside {
    padding: 0 8px;
    z-index: 4;
    background-color: var(--el-bg-color);
    box-shadow: 0.5px 0 0 0 var(--el-border-color-light);
  }

  :deep(.el-header) {
    height: 48px;
    z-index: 3;
    background-color: var(--el-bg-color);
    box-shadow: 0 0.5px 0 0 var(--el-border-color-light);
    display: flex;
    align-items: center;
  }

  .el-main {
    background-color: var(--el-bg-color);
  }

  :deep(.el-sub-menu__title),
  .el-menu-item {
    margin: 6px 0;
    border-radius: 6px;
  }

  .el-menu-item.is-active {
    background-color: var(--el-menu-hover-bg-color);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translate(10px, 0);
  }
}
</style>
