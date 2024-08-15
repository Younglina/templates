<script setup>
import { search } from "@/api/others";
import { getTrackDetail } from "@/api/track";

const { showPg, startPg, donePg } = useProgres();
const route = useRoute();
watch(() => route.params.keywords, loadData);
const mData = reactive({
  result: {},
  musicVideos: [],
  artists: [],
  albums: [],
  tracks: [],
  playlists: [],
});
function searchByType(type) {
  const typeTable = {
    all: 1018,
    musicVideos: 1004,
    tracks: 1,
    albums: 10,
    artists: 100,
    playlists: 1000,
  };
  return search({
    keywords: route.params.keywords,
    type: typeTable[type],
    limit: 16,
  })
    .then((result) => {
      return { result: result.result, type };
    })
    .catch((err) => {
      MessageBox(err.response.data.msg || err.response.data.message);
    });
}

function loadData() {
  startPg();
  function requestAll(requests) {
    Promise.all(requests).then((results) => {
      results.map((res) => {
        const searchType = res.type;
        if (res.result === undefined) return;
        res = res.result;
        switch (searchType) {
          case "all":
            mData.result = result;
            break;
          case "musicVideos":
            mData.musicVideos = res.mvs ?? [];
            break;
          case "artists":
            mData.artists = res.artists ?? [];
            break;
          case "albums":
            mData.albums = res.albums ?? [];
            break;
          case "tracks":
            getTracksDetail(res.songs ?? []);
            break;
          case "playlists":
            mData.playlists = res.playlists ?? [];
            break;
        }
      });
      donePg();
    });
  }

  const requests = [
    searchByType("artists"),
    searchByType("albums"),
    searchByType("tracks"),
  ];
  const requests2 = [searchByType("musicVideos"), searchByType("playlists")];

  requestAll(requests);
  requestAll(requests2);
}

function getTracksDetail(tracks) {
  if (tracks.length === 0) return;
  const trackIDs = tracks.map((t) => t.id);
  getTrackDetail(trackIDs.join(",")).then((result) => {
    mData.tracks = result.songs;
  });
}
loadData();
</script>
<template>
  <div v-show="showPg">
    <div class="flex mt-24px">
      <div class="flex-1 mr-32">
        <div class="title">
          艺人
          <router-link :to="`/search/${$route.params.keywords}/artists`">
            查看更多
          </router-link>
        </div>
        <CoverRow
          type="artist"
          :column-number="3"
          gap="36px 28px"
          :dataList="mData.artists.slice(0, 3)"
        />
      </div>
      <div class="flex-1">
        <div class="title">
          专辑
          <router-link :to="`/search/${$route.params.keywords}/albums`">
            查看更多
          </router-link>
        </div>
        <CoverRow
          type="album"
          :dataList="mData.albums.slice(0, 3)"
          sub-text="artist"
          :column-number="3"
          gap="34px 24px"
        />
      </div>
    </div>
    <div class="title mt-46px">
      歌曲
      <router-link :to="`/search/${$route.params.keywords}/tracks`">
        查看更多
      </router-link>
    </div>
    <TrackList :dataList="mData.tracks" type="tracklist" />
    <div class="title mt-46px">
      视频
      <router-link :to="`/search/${$route.params.keywords}/musicVideos`">
        查看更多
      </router-link>
    </div>
    <MvList :dataList="mData.musicVideos.slice(0, 5)" />
    <div class="title mt-46px">
      歌单
      <router-link :to="`/search/${$route.params.keywords}/playlists`">
        查看更多
      </router-link>
    </div>
    <CoverRow
      type="playlist"
      :dataList="mData.playlists.slice(0, 12)"
      showPlayCount
      sub-text-font-size="14px"
      :column-number="6"
      gap="34px 24px"
    />
  </div>
</template>
<style scoped lang="scss">
.title {
  font-size: 22px;
}
</style>
