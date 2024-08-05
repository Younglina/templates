<script setup>
import { getRecommendPlayList } from "@/utils/playList";
import { toplists } from "@/api/playlist";
import { toplistOfArtists } from "@/api/artist";
import { newAlbums } from "@/api/album";

const pageLists = reactive({
  playlist: {
    title: "推荐歌单",
    subLink: "/explore?category=推荐歌单",
    items: [],
    type: "playlist",
    showPlayCount: true,
  },
  artist: { title: "推荐艺人", items: [], columnNumber: 6, type: "artist" },
  album: {
    title: "新专速递",
    items: [],
    subLink: "/new-album",
    subText: "artist",
    type: "album",
  },
  topLists: {
    title: "排行榜",
    items: [],
    ids: [19723756, 3778678, 991319590, 180106, 60198],
    subLink: "/explore?category=排行榜",
    subText: "updateFrequency",
    type: "playlist",
  },
});

const { showPg, startPg, donePg } = useProgres();
onBeforeMount(() => {
  startPg();
  // 获取推荐歌单
  getRecommendPlayList(10).then((res) => {
    pageLists.playlist.items = res;
    donePg();
  });
  // 获取推荐艺人
  toplistOfArtists().then((data) => {
    let indexs = [];
    const recommendArtists = [];
    while (indexs.length < 6) {
      let tmp = ~~(Math.random() * 100);
      if (!indexs.includes(tmp)) {
        indexs.push(tmp);
        recommendArtists.push(data.list.artists[tmp]);
      }
    }
    recommendArtists.sort((a, b) => a.lastRank - b.lastRank);
    pageLists.artist.items = recommendArtists;
  });
  // 获取推荐专辑
  newAlbums({
    area: "ALL",
    limit: 10,
  }).then((data) => {
    pageLists.album.items = data.albums;
  });
  // 获取指定排行版
  toplists().then((data) => {
    pageLists.topLists.items = data.list.filter((l) =>
      pageLists.topLists.ids.includes(l.id)
    );
  });
});
const showCatOptions = ref(false);
</script>

<template>
  <div v-show="showPg">
    <div v-for="item in pageLists" class="mt-54px">
      <div class="title">
        {{ item.title }}
        <router-link v-if="item.subLink" :to="item.subLink">
          查看更多
        </router-link>
      </div>
      <CoverRow
        :items="item.items"
        :type="item.type"
        :columnNumber="item.columnNumber"
        :subText="item.subText"
        :showPlayCount="item.showPlayCount"
      ></CoverRow>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
