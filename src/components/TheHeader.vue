<script setup>
import { NAVLINK } from "@/constants";
</script>

<template>
  <nav class="header-nav bg-white">
    <div class="flex items-center">
      <button-icon>
        <i class="i-material-symbols-chevron-left-rounded size-28px fw-600" />
      </button-icon>
      <button-icon>
        <i class="i-material-symbols-chevron-right-rounded size-28px fw-600" />
      </button-icon>
    </div>
    <div class="header-links">
      <router-link
        v-for="item in NAVLINK"
        :key="item.name"
        :to="item.link"
        :class="[$route.name === item.name ? 'active' : '']"
      >
        {{ item.title }}
      </router-link>
    </div>
    <div class="header-user">
      <div class="i-material-symbols-account-circle-full" />
    </div>
  </nav>
</template>

<style scoped lang="scss">
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 64px;
  padding: 0 10vw;
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  min-width: var(--page-min-width);
  > div {
    flex: 1;
  }
}
@media (max-width: 1280px) {
  .header-nav {
    padding: 0 5vw;
  }
}

.header-links {
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    font-size: 18px;
    font-weight: 700;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    -webkit-user-drag: none;
    margin: {
      right: 12px;
      left: 12px;
    }
    &:hover {
      background: var(--color-secondary-bg-for-transparent);
      text-decoration: none;
    }
  }
}
.header-user {
  display: flex;
  justify-content: flex-end;
}
</style>
