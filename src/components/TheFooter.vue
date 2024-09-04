<script setup>
import { formatTrackTime } from "@/utils/common";
import { goToListSource, hasListSource } from "@/utils/playList";
import VueSlider from "vue-slider-component";

const store = useMainStore();
const player = computed(() => store.player);
const router = useRouter();
const route = useRoute();
const currentTrack = computed(() => store.player.currentTrack);
const curShowProgress = ref(0);
let lyricsInterval = null;
function setLyricsInterval() {
  lyricsInterval = setInterval(() => {
    const progress = store.player.seek(null, false) ?? 0;
    curShowProgress.value = progress;
  }, 50);
  store.enableScrolling = false;
}

onMounted(() => {
  setLyricsInterval();
});
onUnmounted(() => {
  clearLyricsInterval();
  lyricsInterval = null;
});

// 音量
const volume = computed({
  get() {
    return store.player.volume;
  },
  set(value) {
    store.player.volume = value;
  },
});
function hasList() {
  return hasListSource();
}
function goToList() {
  goToListSource();
}
function goToAlbum() {
  if (currentTrack.value.al.id === 0) return;
  router.push({ path: "/album/" + currentTrack.value?.al.id });
}
function goToArtist(id) {
  router.push({ path: "/artist/" + id });
}
function playNextTrack() {
  player.value.playNextTrack();
}
function switchRepeatMode() {
  player.value.switchRepeatMode();
}
function switchShuffle() {
  player.value.switchShuffle();
}
function mute() {
  player.value.mute();
}
function goToNextTracksPage() {
  route.name === "next" ? router.go(-1) : router.push({ name: "next" });
}
</script>
<template>
  <div class="footer-player">
    <div class="progress-bar" @click.stop>
      <vue-slider
        v-model="curShowProgress"
        :min="0"
        :max="player.currentTrackDuration"
        :interval="1"
        :drag-on-click="true"
        :duration="0"
        :dot-size="12"
        :height="2"
        :tooltip-formatter="formatTrackTime"
        :lazy="true"
        :silent="true"
        @change="store.player.seek($event)"
      ></vue-slider>
    </div>
    <div class="controls">
      <div class="playing">
        <div class="container" @click.stop>
          <img
            :src="
              currentTrack.al &&
              currentTrack.al.picUrl &&
              currentTrack.al.picUrl + '?param=224y224'
            "
            loading="lazy"
            @click="goToAlbum"
          />
          <div class="track-info">
            <div
              :class="['name', { 'has-list': hasList() }]"
              @click="hasList() && goToList()"
            >
              {{ currentTrack.name }}
            </div>
            <div class="artist">
              <span
                v-for="(ar, index) in currentTrack.ar"
                :key="ar.id"
                @click="ar.id && goToArtist(ar.id)"
              >
                <span :class="{ ar: ar.id }"> {{ ar.name }} </span
                ><span v-if="index !== currentTrack.ar.length - 1">, </span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <button-icon
              :title="player.isCurrentTrackLiked ? '喜欢' : '不喜欢'"
              @click.native="likeATrack(player.currentTrack.id)"
            >
              <div
                v-show="!player.isCurrentTrackLiked"
                class="heart-icon i-material-symbols-favorite-outline-rounded"
              />
              <div
                v-show="isLiked"
                class="i-material-symbols-favorite-rounded"
              />
            </button-icon>
          </div>
        </div>
        <div class="blank"></div>
      </div>
      <div class="middle-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <ButtonIcon title="上一首" @click.native="player.playPrevTrack()">
            <i class="i-material-symbols-skip-previous-rounded text-24px" />
          </ButtonIcon>
          <ButtonIcon
            id="play"
            :title="player.playing ? '暂停' : '播放'"
            @click.native="player.playOrPause()"
          >
            <i
              class="play"
              :class="
                player.playing
                  ? 'i-material-symbols-pause-rounded'
                  : 'i-material-symbols-play-arrow-rounded'
              "
            />
          </ButtonIcon>
          <ButtonIcon title="下一首" @click.native="playNextTrack">
            <i class="i-material-symbols-skip-next-rounded text-24px" />
          </ButtonIcon>
        </div>
        <div class="blank"></div>
      </div>
      <div class="right-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <button-icon
            title="播放列表"
            :class="{
              active: $route.name === 'next',
              disabled: player.isPersonalFM,
            }"
            @click.native="goToNextTracksPage"
            ><i
              class="i-material-symbols-library-music-outline-rounded text-20px"
          /></button-icon>
          <ButtonIcon
            :title="player.repeatMode === 'one' ? '单曲循环' : '循环播放'"
            :class="{ active: player.repeatMode !== 'off' }"
            @click.native="switchRepeatMode"
          >
            <i
              v-show="player.repeatMode !== 'one'"
              class="i-material-symbols-repeat-rounded text-20px"
            />
            <i
              v-show="player.repeatMode === 'one'"
              class="i-material-symbols-repeat-one-rounded text-20px"
            />
          </ButtonIcon>
          <ButtonIcon
            title="随机播放"
            :class="{ active: player.shuffle }"
            @click.native="switchShuffle"
          >
            <i class="i-material-symbols-shuffle-rounded text-20px" />
          </ButtonIcon>
          <div class="volume-control">
            <ButtonIcon @click.native="mute">
              <i
                v-show="volume == 0"
                class="i-material-symbols-volume-off-rounded text-20px"
              ></i>
              <i
                v-show="volume <= 0.5 && volume != 0"
                class="i-material-symbols-volume-down-rounded text-20px"
              ></i>
              <i
                v-show="volume > 0.5"
                class="i-material-symbols-volume-up-rounded text-20px"
              ></i>
            </ButtonIcon>
            <div class="volume-bar">
              <VueSlider
                v-model="volume"
                :min="0"
                :max="1"
                :interval="0.01"
                :drag-on-click="true"
                :duration="0"
                tooltip="none"
                :dot-size="12"
              />
            </div>
          </div>
          <ButtonIcon
            title="歌词"
            style="margin-left: 12px"
            @click.native="store.showLyrics = !store.showLyrics"
            ><i class="i-material-symbols-keyboard-arrow-up-rounded text-24px"
          /></ButtonIcon>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.footer-player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  .progress-bar {
    margin-top: -6px;
    margin-bottom: -6px;
    width: 100%;
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 100%;
    padding: {
      right: 10vw;
      left: 10vw;
    }
  }

  @media (max-width: 1336px) {
    .controls {
      padding: 0 5vw;
    }
  }

  .blank {
    flex-grow: 1;
  }

  .playing {
    display: flex;
  }

  .playing .container {
    display: flex;
    align-items: center;
    img {
      height: 46px;
      border-radius: 5px;
      box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
      cursor: pointer;
      user-select: none;
    }
    .track-info {
      height: 46px;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name {
        font-weight: 600;
        font-size: 16px;
        opacity: 0.88;
        color: var(--color-text);
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
      }
      .has-list {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      .artist {
        font-size: 12px;
        opacity: 0.58;
        color: var(--color-text);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        word-break: break-all;
        span.ar {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
.middle-control-buttons {
  display: flex;
}

.middle-control-buttons .container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  .button-icon {
    margin: 0 8px;
  }
  .play {
    height: 42px;
    width: 42px;
    padding: 0px;
    margin: -8px;
  }
}

.right-control-buttons {
  display: flex;
}

.right-control-buttons .container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    margin-left: 24px;
  }
  .active .svg-icon {
    color: var(--color-primary);
  }
  .volume-control {
    margin-left: 4px;
    display: flex;
    align-items: center;
    .volume-bar {
      margin-left: 6px;
      width: 84px;
    }
  }
}

.like-button {
  margin-left: 16px;
}

.button-icon.disabled {
  cursor: default;
  opacity: 0.38;
  &:hover {
    background: none;
  }
  &:active {
    transform: unset;
  }
}
</style>
