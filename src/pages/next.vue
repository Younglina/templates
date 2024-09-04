<script setup>
import { getTrackDetail } from "@/api/track";
const tracks = ref([]);
const store = useMainStore();
const currentTrack = computed(() => store.player.currentTrack);
const playerShuffle = computed(() => store.player.shuffle);

const filteredTracks = computed(() => {
  const trackIDs = store.player.list.slice(
    store.player.current + 1,
    store.player.current + 100
  );
  return tracks.value.filter((t) => trackIDs.includes(t.id)) || [];
});
const playNextTracks = computed(() => {
  return (
    store.player.playNextList.map((tid) => {
      return tracks.value.find((t) => t.id === tid);
    }) || []
  );
});

watch(currentTrack, () => {
  loadTracks();
});
watch(playerShuffle, () => {
  loadTracks();
});
watch(
  () => store.player.playNextList,
  () => {
    loadTracks();
  }
);
onActivated(() => {
  loadTracks();
});
function loadTracks() {
  // 获取播放列表当前歌曲后100首歌
  let trackIDs = store.player.list.slice(
    store.player.current + 1,
    store.player.current + 100
  );

  trackIDs.push(...store.player.playNextList);

  let loadedTrackIDs = tracks.value.map((t) => t.id);

  if (trackIDs.length > 0) {
    getTrackDetail(trackIDs.join(",")).then((data) => {
      let newTracks = data.songs.filter((t) => !loadedTrackIDs.includes(t.id));
      tracks.value.push(...newTracks);
    });
  }
}
</script>

<template>
  <div class="next-tracks">
    <h1>正在播放</h1>
    <TrackList
      :dataList="[currentTrack]"
      type="playlist"
      dbclick-track-func="none"
    />
    <h1 v-show="store.player.playNextList.length > 0">
      插队播放
      <button @click="player.clearPlayNextList()">清除队列</button>
    </h1>
    <TrackList
      v-show="store.player.playNextList?.length > 0"
      :dataList="playNextTracks"
      type="playlist"
      :highlight-playing-track="false"
      dbclick-track-func="playTrackOnListByID"
      item-key="id+index"
      :extra-context-menu-item="['removeTrackFromQueue']"
    />
    <h1>即将播放</h1>
    <TrackList
      :dataList="filteredTracks"
      type="playlist"
      :highlight-playing-track="false"
      dbclick-track-func="playTrackOnListByID"
    />
  </div>
</template>

<style lang="scss" scoped>
h1 {
  margin-top: 36px;
  margin-bottom: 18px;
  cursor: default;
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  button {
    color: var(--color-text);
    border-radius: 8px;
    padding: 0 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    opacity: 0.68;
    font-weight: 500;
    &:hover {
      opacity: 1;
      background: var(--color-secondary-bg);
    }
    &:active {
      opacity: 1;
      transform: scale(0.92);
    }
  }
}
</style>
