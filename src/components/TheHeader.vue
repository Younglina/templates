<script setup>
import { NAVLINK } from "@/constants";
const keywords = ref("");
const router = useRouter();
const route = useRoute();
function doSearch() {
  if (!keywords.value) return;
  if (route.name === "search" && route.params.keywords === keywords.value) {
    return;
  }
  router.push(`/search/${keywords.value}`);
}
</script>

<template>
  <nav class="header-nav bg-white">
    <div class="flex items-center btns">
      <button-icon @click="$router.go(-1)">
        <i class="i-material-symbols-chevron-left-rounded size-28px fw-600" />
      </button-icon>
      <button-icon @click="$router.go(1)">
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
      <TheInput placeholder="搜索" v-model="keywords" @keyup.enter="doSearch">
        <div class="i-material-symbols-search-rounded"></div>
      </TheInput>
      <div @click="$router.push('/login')" class="account">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M11 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c1.1 0 2.66.23 4.11.69c-.61.38-1.11.91-1.5 1.54c-.82-.2-1.72-.33-2.61-.33c-2.97 0-6.1 1.46-6.1 2.1v1.1h8.14c.09.7.34 1.34.72 1.9H3v-3c0-2.66 5.33-4 8-4m7.5-3H22v2h-2v5.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5a2.5 2.5 0 0 1 2.5-2.5c.36 0 .69.07 1 .21z"
          />
        </svg>
      </div>
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
  > div {
    flex: 1;
  }
}
@media (max-width: 1280px) {
  .header-nav {
    padding: 0 5vw;
  }
}

@media (max-width: 970px) {
  .header-nav .btns {
    flex: unset;
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
  align-items: center;
  .input-box {
    width: 200px;
    height: 32px;
  }
  .account {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-secondary-bg-for-transparent);
    margin-left: 8px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
