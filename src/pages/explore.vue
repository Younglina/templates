<script setup>
import { topPlaylist, highQualityPlaylist, toplists } from "@/api/playlist";
import { getRecommendPlayList as getRPlsit } from "@/utils/playList";

const store = useMainStore();
const route = useRoute();
const router = useRouter();

const { showPg, startPg, donePg } = useProgres();
const mData = reactive({
  playlist: [],
  loadingMore: true,
  showLoadMoreButton: true,
  hasMore: true,
  showCatOptions: false,
  currentCategory: "全部",
});
onActivated(() => {
  mData.currentCategory =
    route.params.category === "" ? "全部" : route.params.category;
  loadData();
});

function toCategory(item) {
  mData.currentCategory = item;
  router.push({ path: `/explore/${item}` });
  loadData();
}
function loadData() {
  showPg.value = false;
  startPg();
  mData.showLoadMoreButton = false;
  mData.hasMore = true;
  mData.playlists = [];
  mData.offset = 1;
  getPlaylist();
}
function updatePlaylist(playlists) {
  mData.playlists.push(...playlists);
  mData.loadingMore = false;
  mData.showLoadMoreButton = true;
  donePg();
}

function getPlaylist() {
  mData.loadingMore = true;
  if (mData.currentCategory === "推荐歌单") {
    return getRecommendPlayList();
  }
  if (mData.currentCategory === "精品歌单") {
    return getHighQualityPlaylist();
  }
  if (mData.currentCategory === "排行榜") {
    return getTopLists();
  }
  return getTopPlayList();
}
function getRecommendPlayList() {
  getRPlsit(100, true).then((list) => {
    mData.playlists = [];
    updatePlaylist(list);
  });
}
function getHighQualityPlaylist() {
  let playlists = mData.playlists;
  let before =
    playlists.length !== 0 ? playlists[playlists.length - 1].updateTime : 0;
  highQualityPlaylist({ limit: 50, before }).then((data) => {
    updatePlaylist(data.playlists);
    mData.hasMore = data.more;
  });
}
function getTopLists() {
  toplists().then((data) => {
    mData.playlists = [];
    updatePlaylist(data.list);
  });
}
function getTopPlayList() {
  topPlaylist({
    cat: mData.currentCategory,
    offset: mData.playlists.length,
  }).then((data) => {
    updatePlaylist(data.playlists);
    mData.hasMore = data.more;
  });
}

const subText = computed(() => {
  if (mData.currentCategory === "排行榜") return "updateFrequency";
  if (mData.currentCategory === "推荐歌单") return "copywriter";
  return "none";
});
</script>
<template>
  <div class="explore">
    <h1 class="font-size-56px fw-600">发现</h1>
    <div class="flex flex-wrap cats-wrap z-1 pos-relative">
      <div
        v-for="item in store.settings.enabledPlaylistCategories"
        :key="item"
        :class="[
          'cats',
          { active: mData.currentCategory === item && !mData.showCatOptions },
        ]"
        @click="toCategory(item)"
      >
        {{ item }}
      </div>
      <div
        :class="['cats', { active: mData.showCatOptions }]"
        @click="mData.showCatOptions = !mData.showCatOptions"
      >
        <div class="i-material-symbols-more-horiz"></div>
      </div>
    </div>
    <div class="mt-24px">
      <CoverRow
        type="playlist"
        :dataList="mData.playlists"
        :subText="subText"
        :show-play-button="true"
        :showPlayCount="mData.currentCategory !== '排行榜' ? true : false"
        :image-size="mData.currentCategory !== '排行榜' ? 512 : 1024"
      />
      <div
        v-show="!['推荐歌单', '排行榜'].includes(mData.currentCategory)"
        class="load-more"
      >
        <ButtonIcon
          v-show="mData.showLoadMoreButton && mData.hasMore"
          color="grey"
          @click.native="getPlaylist"
        >
          加载更多
        </ButtonIcon>
      </div>
    </div>
  </div>
  <Teleport to=".cats-wrap">
    <div v-if="mData.showCatOptions" @toggleCat="onToggleCat">
      <CatsPanel></CatsPanel>
    </div>
  </Teleport>
</template>
<style scoped lang="scss">
.cats {
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 10px;
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
  transition: 0.2s;

  &:hover {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }
}
.cats.active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}
.load-more {
  text-align: center;
  margin-top: 32px;
  :deep(.button-icon) {
    height: 40px;
    min-width: 40px;
    background-color: var(--color-secondary-bg);
    color: var(--color-text);
    opacity: 0.78;
    border-radius: 8px;
    padding: 8px 16px;
    width: auto;
    font-size: 18px;
    line-height: 18px;
    font-weight: 600;
    &:hover {
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
