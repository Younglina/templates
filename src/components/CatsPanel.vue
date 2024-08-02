<script setup>
import { playlistCategories } from "@/constants";
const store = useMainStore();
const allBigCats = ["语种", "风格", "场景", "情感", "主题"];
// defineEmits(["toggleCat"]);
function getCatsByBigCat(name) {
  return playlistCategories.filter((c) => c.bigCat === name);
}
</script>
<template>
  <div class="panel">
    <div v-for="bigCat in allBigCats" :key="bigCat" class="big-cat">
      <div class="name">{{ bigCat }}</div>
      <div class="cats">
        <div
          v-for="cat in getCatsByBigCat(bigCat)"
          :key="cat.name"
          class="cat"
          :class="{
            active: store.settings.enabledPlaylistCategories.includes(cat.name),
          }"
          @click="store.togglePlaylistCategory(cat.name)"
        >
          <span>{{ cat.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.panel {
  position: absolute;
  left: 0;
  right: -10px;
  bottom: -10px;
  transform: translateY(100%);
  z-index: 1;
  background: var(--color-secondary-bg);
  border-radius: 10px;
  padding: 8px;
  color: var(--color-text);

  .big-cat {
    display: flex;
    margin-bottom: 32px;
  }

  .name {
    font-size: 24px;
    font-weight: 700;
    opacity: 0.68;
    margin-left: 24px;
    min-width: 54px;
    height: 26px;
    margin-top: 8px;
  }
  .cats {
    margin-left: 24px;
    display: flex;
    flex-wrap: wrap;
  }
  .cat {
    user-select: none;
    margin: 4px 0px 0 0;
    display: flex;
    // justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    transition: 0.2s;
    min-width: 98px;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 6px 12px;
      height: 26px;
      border-radius: 10px;
      opacity: 0.88;
      &:hover {
        opacity: 1;
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
      }
    }
  }
  .cat.active {
    color: var(--color-primary);
  }
}
</style>
