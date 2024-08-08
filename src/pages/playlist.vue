<script setup>
import {
  getPlaylistDetail,
  subscribePlaylist,
  deletePlaylist,
} from "@/api/playlist";
import { formatDate } from "@/utils/common";
import { getTrackDetail } from "@/api/track";
const route = useRoute();
const { showPg, startPg, donePg } = useProgres();
const store = useMainStore();

const mData = reactive({
  show: false,
  tracks: [],
  lastLoadedTrackIndex: 0,
  hasMore: true,
});
const playlist = ref({
  id: 0,
  coverImgUrl: "",
  creator: {
    userId: "",
  },
  trackIds: [],
});
onMounted(() => {
  if (route.name === "likedSongs") {
    loadData(mData.likedSongPlaylistID);
  } else {
    loadData(route.params.id);
  }
  startPg();
});

function loadData(id) {
  mData.id = id;
  getPlaylistDetail(mData.id, true)
    .then((data) => {
      playlist.value = data.playlist;
      mData.tracks = data.playlist.tracks;
      donePg();
      mData.show = true;
      mData.lastLoadedTrackIndex = data.playlist.tracks.length - 1;
      return data;
    })
    .then(() => {
      if (playlist.value.trackCount > mData.tracks.length) {
        mData.loadingMore = true;
        loadMore();
      }
    });
}
function loadMore(loadNum = 100) {
  let trackIDs = playlist.value.trackIds.filter((t, index) => {
    if (
      index > mData.lastLoadedTrackIndex &&
      index <= mData.lastLoadedTrackIndex + loadNum
    ) {
      return t;
    }
  });
  trackIDs = trackIDs.map((t) => t.id);
  getTrackDetail(trackIDs.join(",")).then((data) => {
    mData.tracks.push(...data.songs);
    mData.lastLoadedTrackIndex += trackIDs.length;
    mData.loadingMore = false;
    if (mData.lastLoadedTrackIndex + 1 === playlist.value.trackIds.length) {
      mData.hasMore = false;
    } else {
      mData.hasMore = true;
    }
  });
}
function playPlaylistByID() {}

function openMenu() {}
function toggleFullDescription() {}
function likePlaylist() {}
</script>
<template>
  <div v-show="mData.show" class="mt-32px">
    <div class="list-info">
      <Cover
        :id="playlist.id"
        :image-url="playlist.coverImgUrl + '?param=${size}y${size}'"
        :fixed-size="288"
        clickCoverToPlay
        alwaysShowShadow
        type="playlist"
        @click.right.native="openMenu"
      ></Cover>
      <div class="info">
        <div class="list-title" @click.right="openMenu">
          <div v-if="playlist.privacy === 10" class="lock-icon" />
          {{ playlist.name }}
        </div>
        <div class="artist">
          Playlist by
          <a
            :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`"
            target="blank"
            >{{ playlist.creator.nickname }}
          </a>
        </div>
        <div class="date-and-count">
          最后更新于
          {{ formatDate(playlist.updateTime) }} · {{ playlist.trackCount }}
          首歌
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ playlist.description }}
        </div>
        <div class="buttons">
          <ButtonIcon
            class="play-button"
            grey
            @click.native="playPlaylistByID()"
          >
            <div class="i-material-symbols-play-arrow-rounded size-26px" />
            播放
          </ButtonIcon>
          <ButtonIcon
            v-if="playlist.creator.userId !== store.user.userId"
            grey
            @click.native="likePlaylist"
          >
            <div
              :class="[
                playlist.subscribed
                  ? 'i-material-symbols-favorite-rounded'
                  : 'i-material-symbols-favorite-outline-rounded',
                playlist.subscribed ? 'c-#335eea' : '',
              ]"
              :style="{
                backgroundColor: playlist.subscribed
                  ? 'var(--color-secondary-bg)'
                  : '',
              }"
            ></div>
          </ButtonIcon>
          <ButtonIcon grey @click.native="openMenu">
            <div class="i-material-symbols-more-horiz"></div>
          </ButtonIcon>
        </div>
      </div>
    </div>

    <TrackList :id="playlist.id" :dataList="mData.tracks" type="playlist" />
  </div>
</template>
<style scoped lang="scss">
.list-info {
  display: flex;
  margin-bottom: 72px;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    .list-title {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-text);
    }
    .artist {
      font-size: 18px;
      color: var(--color-text);
      margin-top: 24px;
    }
    .date-and-count {
      font-size: 14px;
      opacity: 0.88;
      color: var(--color-text);
      margin-top: 2px;
    }
    .description {
      font-size: 14px;
      opacity: 0.78;
      color: var(--color-text);
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
    }
  }
  .buttons {
    display: flex;
    margin-top: 32px;
    .button-icon {
      font-size: 16px;
      margin-right: 16px;
      margin-left: 0px;
    }
    .play-button {
      color: var(--color-primary);
      padding: 8px 12px 8px 8px;
      background-color: var(--color-primary-bg);
    }
  }
}
</style>
