<script setup>
const props = defineProps({
  dataList: {
    type: Array,
    required: true,
    default: () => [],
  },
  type: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    default: 0,
  },
  columnNumber: {
    type: Number,
    default: 4,
  },
  itemKey: {
    type: String,
    default: "id",
  },
  highlightPlayingTrack: {
    type: Boolean,
    default: true,
  },
  dbclickTrackFunc: {
    type: String,
    default: "default",
  },
});
const listStyles = computed(() => {
  if (props.type === "tracklist") {
    return {
      display: "grid",
      gap: "4px",
      gridTemplateColumns: `repeat(${props.columnNumber}, 1fr)`,
    };
  }
});
const route = useRoute();
const store = useMainStore();
function playThisList(trackID) {
  if (props.dbclickTrackFunc === "default") {
    playThisListDefault(trackID);
  } else if (props.dbclickTrackFunc === "none") {
    // do nothing
  } else if (props.dbclickTrackFunc === "playTrackOnListByID") {
    store.player.playTrackOnListByID(trackID);
  } else if (props.dbclickTrackFunc === "playPlaylistByID") {
    store.player.playPlaylistByID(props.id, trackID);
  } else if (route.name === "searchType") {
    let trackIDs = props.dataList.map((t) => t.id || t.songId);
    store.player.replacePlaylist(trackIDs, props.id, "artist", trackID);
  } else if (props.dbclickTrackFunc === "dailyTracks") {
    let trackIDs = props.dataList.map((t) => t.id);
    store.player.replacePlaylist(trackIDs, "/daily/songs", "url", trackID);
  } else if (props.dbclickTrackFunc === "playCloudDisk") {
    let trackIDs = props.dataList.map((t) => t.id || t.songId);
    store.player.replacePlaylist(trackIDs, props.id, "cloudDisk", trackID);
  }
}

function playThisListDefault(trackID) {
  if (props.type === "playlist") {
    store.player.playPlaylistByID(props.id, trackID);
  } else if (props.type === "album") {
    store.player.playAlbumByID(props.id, trackID);
  } else if (props.type === "tracklist") {
    let trackIDs = props.dataList.map((t) => t.id);
    store.player.replacePlaylist(trackIDs, props.id, "artist", trackID);
  }
}

const menuRef = ref(null);
const rightTrack = ref({
  id: 0,
  name: "",
  ar: [{ name: "" }],
  al: { picUrl: "" },
});
const rightTrackIdx = ref(-1);
function openMenu(e, track, idx) {
  rightTrack.value = track;
  rightTrackIdx.value = idx;
  menuRef.value.openMenu(e);
}
function play() {
  store.player.addTrackToPlayNext(rightTrack.value.id, true);
}

const menuActions = [
  {
    name: "hr",
  },
  {
    name: "播放",
    action: play,
    cloudDisk: false,
  },
  {
    name: "添加到队列",
    action: play,
    cloudDisk: false,
  },
  {
    name: "hr",
  },
  {
    name: "添加到我喜欢的音乐",
    action: play,
  },
  {
    name: "添加到歌单",
    action: play,
    cloudDisk: false,
  },
  {
    name: "复制链接",
  },
];
</script>

<template>
  <div v-if="dataList.length">
    <div :style="listStyles">
      <TrackListItem
        v-for="(track, index) in dataList"
        :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
        :track-prop="track"
        :track-no="index + 1"
        :type="type"
        :highlight-playing-track="highlightPlayingTrack"
        @dblclick.native="playThisList(track.id || track.songId)"
        @click.right.native="openMenu($event, track, index)"
      />
    </div>
    <ContextMenu ref="menuRef">
      <div v-show="type !== 'cloudDisk'" class="item-info">
        <img :src="`${rightTrack.al.picUrl}?param=224y224`" loading="lazy" />
        <div class="info">
          <div class="track-title">
            {{ rightTrack.name }}
          </div>
          <div class="subtitle">
            {{ rightTrack.ar[0].name }}
          </div>
        </div>
      </div>
      <div v-for="(item, idx) in menuActions" :key="idx" @click="item.action">
        <div v-if="item.name !== 'hr'" class="item">
          {{ item.name }}
        </div>
        <hr v-else />
      </div>
    </ContextMenu>
  </div>
</template>

<style scoped lang="scss"></style>
