<script setup>
import { getRecommendPlayList } from '@/utils/playList';

const show = ref(false)
const recommendPlaylist = ref({})
getRecommendPlayList(10, false).then(items => {
  recommendPlaylist.value.items = items;
  // NProgress.done();
  show.value = true;
});
</script>
<template>
  <div v-show="show" class="home-page">
    <CoverRow :items="recommendPlaylist.items"></CoverRow>
  </div>
</template>

<style scoped lang='scss'></style>
