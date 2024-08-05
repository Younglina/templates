<script setup>
const props = defineProps({
  tracks: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
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
function playThisList() {}

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
  console.log(123);
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
  <div>
    <div :style="listStyles">
      <TrackListItem
        v-for="(track, index) in tracks"
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
        <img :src="rightTrack.al.picUrl + '?param=224y224'" loading="lazy" />
        <div class="info">
          <div class="track-title">{{ rightTrack.name }}</div>
          <div class="subtitle">{{ rightTrack.ar[0].name }}</div>
        </div>
      </div>
      <div v-for="(item, idx) in menuActions" :key="idx" @click="item.action">
        <div v-if="item.name !== 'hr'" class="item">{{ item.name }}</div>
        <hr v-else />
      </div>
    </ContextMenu>
  </div>
</template>
<style scoped lang="scss"></style>
