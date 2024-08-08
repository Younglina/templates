<script setup>
import { resizeImage } from "@/utils/common.js";
import { isAccountLoggedIn } from "@/utils/auth";
import CoverRow from "@/components/CoverRow.vue";
import TrackList from "@/components/TrackList.vue";
import MvList from "@/components/MvList.vue";

const store = useMainStore();
const userInfo = store.baseData.user;
const liked = store.liked;
const { showPg, startPg, donePg } = useProgres();

const tabs = {
  playlists: {
    key: "playlists",
    data: [],
    type: "playlist",
    subText: "creator",
    showPlayButton: true,
    label: "全部歌单",
    component: CoverRow,
    columnNumber: 5,
  },
  albums: {
    key: "albums",
    data: [],
    type: "album",
    subText: "artist",
    showPlayButton: true,
    label: "专辑",
    component: CoverRow,
    columnNumber: 5,
  },
  artists: {
    key: "artists",
    data: [],
    type: "artist",
    subText: "artist",
    showPlayButton: true,
    label: "艺人",
    component: CoverRow,
    columnNumber: 5,
  },
  mvs: { key: "mvs", data: [], label: "MV", component: MvList },
  cloudDisk: {
    key: "cloudDisk",
    data: [],
    id: -8,
    type: "cloudDisk",
    label: "云盘",
    columnNumber: 3,
    component: TrackList,
  },
  playHistory: {
    key: "playHistory",
    data: [],
    type: "tracklist",
    label: "听歌排行",
    columnNumber: 1,
    component: TrackList,
  },
};
const currentTab = shallowRef({});
const playHistoryMode = ref("");
function updateTab(key, subKey) {
  if (!isAccountLoggedIn() && key !== "playlists") {
    MessageBox({
      title: "提示",
      message: "请先登录",
      showFooter: true,
    });
    return;
  }
  currentTab.value = tabs[key];
  if (key === "playlists") {
    currentTab.value.data = liked.playlists.slice(1);
  } else if (key !== "playHistory") {
    currentTab.value.data = liked[key];
  } else {
    playHistoryMode.value = subKey;
    currentTab.value.data =
      liked.playHistory[subKey === "week" ? "weekData" : "allData"];
  }
  if (!subKey) {
    const targetElement = document.querySelector(".tabs");
    const mainWrap = document.querySelector(".main-wrap");
    const rect = targetElement.getBoundingClientRect();
    if (rect.top > 100) {
      mainWrap.scrollTo({ top: rect.top, behavior: "smooth" });
    }
  }
}

function loadData() {
  startPg();
  showPg.value = false;
  if (liked.songsWithDetails.length > 0) {
    donePg();
    // getRandomLyric();
  } else {
    store.fetchLikedSongsWithDetails().then(() => {
      donePg();
      // getRandomLyric();
    });
  }
  store.fetchLikedSongs();
  store.fetchLikedPlaylist();
  store.fetchLikedAlbums();
  store.fetchLikedArtists();
  store.fetchLikedMVs();
  store.fetchCloudDisk();
  store.fetchPlayHistory();
}

onMounted(() => {
  donePg();
  currentTab.value = tabs.playlists;
  currentTab.value.data = liked.playlists.slice(1);
  // loadData();
});
</script>
<template>
  <div v-show="showPg">
    <h1>
      <img
        class="avatar"
        :src="resizeImage(userInfo.avatarUrl)"
        loading="lazy"
        alt="avatar"
      />
      {{ userInfo.nickname }}的音乐库
    </h1>
    <div class="flex mt-24px">
      <div class="liked-lyr">
        <div>歌词</div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-size-24px fw-700">我喜欢的音乐</p>
            <p class="font-size-15px mt-2px">
              {{ store.liked.songs.length }} 首歌
            </p>
          </div>
          <div class="play-wrap">
            <div class="i-material-symbols-play-arrow-rounded" />
          </div>
        </div>
      </div>
      <div class="liked-songs">
        <TrackList
          :id="liked.playlists.length > 0 ? liked.playlists[0].id : 0"
          :dataList="liked.songsWithDetails"
          :column-number="3"
          type="tracklist"
          dbclick-track-func="playPlaylistByID"
        />
      </div>
    </div>

    <div class="lists-warp">
      <div class="tabs">
        <div
          v-for="item in tabs"
          :key="item.key"
          class="tab"
          :class="{ active: item.key === currentTab.key }"
          @click="updateTab(item.key)"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        v-show="currentTab.key === 'playHistory'"
        class="tabs important-mt-10px"
      >
        <button
          class="tab"
          :class="{ active: playHistoryMode === 'week' }"
          @click="updateTab('playHistory', 'week')"
        >
          最近一周
        </button>
        <button
          class="tab"
          :class="{ active: playHistoryMode === 'all' }"
          @click="updateTab('playHistory', 'all')"
        >
          所有时间
        </button>
      </div>
      <component
        class="mt-24px"
        :is="currentTab.component"
        :dataList="currentTab.data"
        :type="currentTab.type"
        :sub-text="currentTab.subText"
        :column-number="currentTab.columnNumber"
        :show-play-button="true"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
h1 {
  font-size: 42px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  .avatar {
    height: 44px;
    margin-right: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.2);
  }
}
.liked-lyr {
  flex: 3;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  box-sizing: border-box;
  background: var(--color-primary-bg);
  color: var(--color-primary);
}
.liked-songs {
  flex: 7;
  margin-top: 8px;
  margin-left: 36px;
  overflow: hidden;
}
.play-wrap {
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: 44px;
  background: var(--color-primary);
  border-radius: 50%;
  transition: 0.2s;
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.2);
  cursor: default;

  div {
    color: var(--color-primary-bg);
    height: 30px;
    width: 30px;
  }
  &:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.4);
  }
  &:active {
    transform: scale(0.94);
  }
}
.lists-warp {
  min-height: calc(100vh - 188px);
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: var(--color-text);
  margin-top: 54px;
  .tab {
    font-weight: 600;
    padding: 8px 14px;
    margin-right: 14px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    opacity: 0.68;
    &:hover {
      opacity: 0.88;
      background-color: var(--color-secondary-bg);
    }
  }
  .tab.active {
    opacity: 0.88;
    background-color: var(--color-secondary-bg);
  }
}
</style>
