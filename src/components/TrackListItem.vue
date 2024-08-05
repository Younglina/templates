<script setup>
import { formatTime } from "@/utils/common";
const props = defineProps({
  trackProp: Object,
  trackNo: Number,
  type: {
    type: String,
    required: true,
  },
  highlightPlayingTrack: {
    type: Boolean,
    required: true,
  },
});
const store = useMainStore();

const trackComputed = computed(() => {
  return props.type === "cloudDisk"
    ? props.trackProp.simpleSong
    : props.trackProp;
});
const track = toRaw(trackComputed.value || {});
const playable = computed(() => {
  return track?.privilege?.pl > 0 || track?.playable;
});

const trackClass = computed(() => {
  let trackClass = [props.type];
  if (!playable.value) trackClass.push("disable");
  if (store.player.currentTrack.id === track?.id && props.highlightPlayingTrack)
    trackClass.push("playing");
  // if (props.focus) trackClass.push("focus");
  return trackClass;
});

const isAlbum = computed(() => {
  return props.type === "album";
});
const imgUrl = computed(() => {
  let image =
    track?.al?.picUrl ??
    track?.album?.picUrl ??
    "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
  return image + "?param=224y224";
});
const artists = computed(() => {
  const { ar, artists } = track;
  if (ar != null) return ar;
  if (artists != null) return artists;
  return [];
});
const showAlbumName = computed(() => {
  return props.type !== "album" && props.type !== "tracklist";
});
const showTrackTime = computed(() => {
  return props.type !== "tracklist";
});
const showLikeButton = computed(() => {
  return props.type !== "tracklist" && props.type !== "cloudDisk";
});
const album = computed(() => {
  return track.album || track.al || track?.simpleSong?.al;
});
const isLiked = computed(() => {
  return store.liked.songs.includes(track?.id);
});

function goToAlbum() {}
function likeThisSong() {}
</script>
<template>
  <div class="track" :class="trackClass">
    <img v-if="!isAlbum" :src="imgUrl" loading="lazy" @click="goToAlbum" />
    <div class="title-artist">
      <div class="track-title">
        {{ track.name }}
      </div>
      <div v-if="!isAlbum" class="artist">
        <ArtistsInLine :artists="artists" />
      </div>
    </div>
    <div v-if="showAlbumName" class="album">
      <router-link v-if="album && album.id" :to="`/album/${album.id}`">
        {{ album.name }}
      </router-link>
    </div>
    <div v-if="showLikeButton" class="actions">
      <ButtonIcon @click="likeThisSong">
        <div
          v-show="!isLiked"
          class="i-material-symbols-favorite-outline-rounded heart-icon"
        ></div>
        <div v-show="isLiked" class="i-material-symbols-favorite-rounded"></div>
      </ButtonIcon>
    </div>
    <div v-if="showTrackTime" class="time">
      {{ formatTime(track.dt) }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.track {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  user-select: none;
  &:hover {
    background: var(--color-secondary-bg);
    .heart-icon {
      visibility: visible;
    }
  }
  .heart-icon {
    visibility: hidden;
  }
  img {
    border-radius: 8px;
    height: 46px;
    width: 46px;
    margin-right: 20px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }
  .title-artist {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .track-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    cursor: default;
    padding-right: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
    .featured {
      margin-right: 2px;
      font-weight: 500;
      font-size: 14px;
      opacity: 0.72;
    }
    .sub-title {
      color: #7a7a7a;
      opacity: 0.7;
      margin-left: 4px;
    }
  }
  .artist {
    margin-top: 2px;
    font-size: 13px;
    opacity: 0.68;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    a {
      span {
        margin-right: 3px;
        opacity: 0.8;
      }
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .album {
    flex: 1;
    display: flex;
    font-size: 16px;
    opacity: 0.88;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .time,
  .count {
    font-size: 16px;
    width: 50px;
    cursor: default;
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    font-variant-numeric: tabular-nums;
    opacity: 0.88;
    color: var(--color-text);
  }
  .count {
    font-weight: bold;
    font-size: 22px;
    line-height: 22px;
  }
}

.track.album {
  height: 32px;
}

.actions {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}
.track.disable {
  img {
    filter: grayscale(1) opacity(0.6);
  }
  .track-title,
  .artist,
  .album,
  .time,
  .no,
  .featured {
    opacity: 0.28 !important;
  }
  &:hover {
    background: none;
  }
}
</style>
