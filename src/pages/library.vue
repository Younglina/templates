<script setup>
import { randomNum, resizeImage } from "@/utils/common.js";
import { isAccountLoggedIn } from "@/utils/auth";
import { getLyric } from "@/api/track";
import CoverRow from "@/components/CoverRow.vue";
import TrackList from "@/components/TrackList.vue";
import MvList from "@/components/MvList.vue";

const store = useMainStore();
const router = useRouter();
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
    playHistoryMode.value = subKey || "weekData";
    currentTab.value.data = liked.playHistory[subKey || "weekData"];
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

const lyrics = ref("");
function getRandomLyric() {
  if (liked.songs.length === 0) return;
  getLyric(liked.songs[randomNum(0, liked.songs.length - 1)]).then((data) => {
    if (data.lrc !== undefined) {
      const isInstrumental = data.lrc.lyric
        .split("\n")
        .filter((l) => l.includes("纯音乐，请欣赏"));
      if (isInstrumental.length === 0) {
        lyrics.value = data.lrc.lyric;
      }
    }
  });
}
const showLyric = computed(() => {
  const lyric = lyrics.value;
  if (!lyric) return [];

  const lyricLine = lyric
    .split("\n")
    .filter((line) => !line.includes("作词") && !line.includes("作曲"));
  const lyricsToPick = Math.min(lyricLine.length, 3);
  const randomUpperBound = lyricLine.length - lyricsToPick;
  const startLyricLineIndex = randomNum(0, randomUpperBound - 1);
  return lyricLine
    .slice(startLyricLineIndex, startLyricLineIndex + lyricsToPick)
    .map((item) => item.split("]").pop().trim());
});

function loadData() {
  startPg();
  showPg.value = false;
  if (liked.songsWithDetails.length > 0) {
    donePg();
    getRandomLyric();
  } else {
    store.fetchLikedSongsWithDetails().then(() => {
      donePg();
      getRandomLyric();
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
  if (!isAccountLoggedIn()) {
    return router.push("/login");
  }
  currentTab.value = tabs.playlists;
  currentTab.value.data = liked.playlists.slice(1);
  loadData();
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
    <div class="mt-24px flex">
      <div class="liked-lyr">
        <div>
          <p>
            <span
              v-for="(line, index) in showLyric"
              v-show="line !== ''"
              :key="`${line}${index}`"
              >{{ line }}<br
            /></span>
          </p>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-size-24px fw-700">我喜欢的音乐</p>
            <p class="mt-2px font-size-15px">
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
          :data-list="liked.songsWithDetails"
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
          :class="{ active: playHistoryMode === 'weekData' }"
          @click="updateTab('playHistory', 'weekData')"
        >
          最近一周
        </button>
        <button
          class="tab"
          :class="{ active: playHistoryMode === 'allData' }"
          @click="updateTab('playHistory', 'allData')"
        >
          所有时间
        </button>
      </div>
      <component
        :is="currentTab.component"
        class="mt-24px"
        :data-list="currentTab.data"
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
