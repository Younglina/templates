<script setup>
import { getRecommendPlayList } from '@/utils/playList';
import { toplistOfArtists } from '@/api/artist';
import { toplists } from '@/api/playlist';
import { newAlbums } from '@/api/album';
import NProgress from 'nprogress';
const pageData = reactive({
  // 整个页面的显示
  show: false,
  // 推荐歌单
  recommendPlaylist: { items: [] },
  // 推荐艺人
  recommendArtists: { indexs: [], items: [] },
  // 新专速递
  newReleasesAlbum: { items: [] },
  // 排行榜
  topList: {
    items: [],
    ids: [19723756, 3779629, 3778678, 180106, 60198],
  }
})

const rows = [
  { key: 'recommendPlaylist', title: '推荐歌单', type: 'playlist', link: '/explore?category=推荐歌单', subText: 'copywriter' },
  { key: 'recommendArtists', title: '推荐艺人', type: 'artist', columnNumber: 6 },
  { key: 'newReleasesAlbum', title: '新专速递', type: 'album', link: '/new-album', subText: 'artist' },
  { key: 'topList', title: '排行榜', type: 'playlist', link: '/explore?category=排行榜', subText: 'updateFrequency', imgSize: '1024' },
]

setTimeout(() => {
  if (!pageData.show) NProgress.start();
}, 1000);
onMounted(() => {
  getRecommendPlayList(10, false).then(items => {
    pageData.recommendPlaylist.items = items;
    NProgress.done();
    pageData.show = true;
  });
  // 100个里面随机取6个
  toplistOfArtists().then(data => {
    let indexs = [];
    while (indexs.length < 6) {
      let tmp = ~~(Math.random() * 100);
      if (!indexs.includes(tmp)) indexs.push(tmp);
    }
    pageData.recommendArtists.indexs = indexs;
    pageData.recommendArtists.items = data.list.artists.filter((_, index) =>
      indexs.includes(index)
    );
  });
  newAlbums({
    area: 'ALL',
    limit: 10,
  }).then(data => {
    pageData.newReleasesAlbum.items = data.albums;
  });
  toplists().then(data => {
    pageData.topList.items = data.list.filter(l =>
      pageData.topList.ids.includes(l.id)
    );
  });
})
</script>

<template>
  <div v-show="pageData.show" class="home-page">
    <div class="index-row">
      <div class="wy-title"> For You </div>
      <div class="for-you-row">
        <DailyTracksCard ref="DailyTracksCard" />
        <RandomSong />
      </div>
    </div>
    <div v-for="item in rows" :key="item.key" class="mt-54px">
      <div class="wy-title">
        {{ item.title }}
        <router-link v-if="item.link" class="text-13px font-600 opacity-68" :to="item.link">查看更多</router-link>
      </div>
      <CoverRow :type="item.type" :items="pageData[item.key].items" :column-number="item.columnNumber"
        :sub-text="item.subText" :image-size="item.imgSize"></CoverRow>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.for-you-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}
</style>
