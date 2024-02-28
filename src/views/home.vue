<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
-->
<script setup>
import { getRecommendPlayList } from '@/utils/playList';
import { toplistOfArtists } from '@/api/artist';
import NProgress from 'nprogress';
// 整个页面的显示
const show = ref(false)
// 推荐歌单
const recommendPlaylist = ref({})
// 推荐艺人
const recommendArtists = reactive({ indexs: [], items: [] })
onMounted(() => {
  setTimeout(() => {
    if (!show.value) NProgress.start();
  }, 1000);
  getRecommendPlayList(10, false).then(items => {
    recommendPlaylist.value.items = items;
    NProgress.done();
    show.value = true;
  });
  // 100个里面随机取6个
  toplistOfArtists().then(data => {
    let indexs = [];
    while (indexs.length < 6) {
      let tmp = ~~(Math.random() * 100);
      if (!indexs.includes(tmp)) indexs.push(tmp);
    }
    recommendArtists.indexs = indexs;
    recommendArtists.items = data.list.artists.filter((_, index) =>
      indexs.includes(index)
    );
  });
})
</script>
<template>
  <div v-show="show" class="home-page">
    <div class="mt-54px">
      <div class="wy-title">
        推荐歌单
        <router-link class="text-13px font-600 opacity-68" to="explore?category=推荐歌单">查看更多</router-link>
      </div>
      <CoverRow :items="recommendPlaylist.items"></CoverRow>
    </div>
    <div class="mt-54px">
      <div class="wy-title">
        推荐艺人
      </div>
      <CoverRow type="artist" :items="recommendArtists.items" :column-number="6"></CoverRow>
    </div>
  </div>
</template>

<style scoped lang='scss'></style>
