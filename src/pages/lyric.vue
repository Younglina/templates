<script setup>
import ColorThief from "colorthief";
import VueSlider from "vue-slider-component";
import { formatTrackTime } from "@/utils/common";
import useLyric from "@/utils/useLyric";

const store = useMainStore();
const player = computed(() => store.player);

// 歌曲相关
const currentTrack = computed(() => store.player.currentTrack || {});
const artist = computed(() => {
  return currentTrack.value?.ar
    ? currentTrack.value.ar[0]
    : { id: 0, name: "unknown" };
});
const album = computed(() => {
  return currentTrack.value?.al || { id: 0, name: "unknown" };
});
function likeATrack() {}
function addToPlaylist() {}
function switchRepeatMode() {}
function playPrevTrack() {}
function playNextTrack() {
  if (player.value.isPersonalFM) {
    player.value.playNextFMTrack();
  } else {
    player.value.playNextTrack();
  }
}
function switchShuffle() {}

// 音量
const volume = ref(0);

// 背景相关
const backgroundStyle = ref("");
const imgUrl = computed(() => {
  return currentTrack?.value?.al?.picUrl + "?param=1024y1024";
});
async function getCoverColor() {
  const cover = document.getElementById("trackImg");
  const colorThief = new ColorThief();
  async function setStyle(cover) {
    const coverColor = await colorThief.getPalette(cover, 2);
    backgroundStyle.value = `background-image: linear-gradient(to top left, rgb(${coverColor[0].join()}), rgb(${coverColor[1].join()}))`;
  }
  if (cover.complete) {
    setStyle(cover);
  } else {
    cover.addEventListener("load", function () {
      setStyle(cover);
    });
  }
}

// 歌词相关
const {
  getLyrics,
  switchLyricType,
  clickLyricLine,
  setLyricsInterval,
  clearLyricsInterval,
  lyrics,
  noLyric,
  lyricType,
  isShowLyricTypeSwitch,
  highlightLyricIndex,
  curShowProgress,
} = useLyric();

watch(
  () => store.showLyrics,
  (val) => {
    if (val) {
      setLyricsInterval();
    } else {
      clearLyricsInterval();
    }
  }
);

watch(currentTrack, async (val) => {
  await getLyrics(val);
  getCoverColor();
});

onMounted(async () => {
  getCoverColor();
  await getLyrics(currentTrack.value);
});
</script>
<template>
  <transition name="slide-up">
    <div class="lyric-wrap" :class="{ 'no-lyric': noLyric }" data-theme="dark">
      <!-- 主背景色，通过colorthief获取 -->
      <div class="gradient-background" :style="backgroundStyle"></div>
      <!-- 左侧图片、歌曲信息、歌曲控制等相关功能 -->
      <div class="left-wrap">
        <div>
          <!-- 歌曲图片 -->
          <div class="cover">
            <div class="cover-container">
              <img
                :src="imgUrl"
                id="trackImg"
                loading="lazy"
                crossorigin="anonymous"
              />
              <div
                class="shadow"
                :style="{ backgroundImage: `url(${imgUrl})` }"
              ></div>
            </div>
          </div>
          <!-- 歌曲相关功能 -->
          <div class="controls-wrap">
            <div class="control-top">
              <!-- 歌曲信息 -->
              <div class="track-info">
                <div class="track-title" :title="currentTrack.name">
                  <span>
                    {{ currentTrack.name }}
                  </span>
                </div>
                <div class="subtitle">
                  <router-link
                    :to="`/artist/${artist.id}`"
                    @click.native="store.toggleLyrics"
                    >{{ artist.name }}
                  </router-link>
                  <span>
                    -
                    <router-link
                      :to="`/album/${album.id}`"
                      :title="album.name"
                      @click.native="store.toggleLyrics"
                      >{{ album.name }}
                    </router-link>
                  </span>
                </div>
              </div>
              <!-- 音量、喜欢功能 -->
              <div class="volume-like">
                <!-- 音量控制 -->
                <div class="volume-control">
                  <ButtonIcon>
                    <i
                      v-show="volume == 0"
                      class="i-material-symbols-volume-off-rounded"
                    ></i>
                    <i
                      v-show="volume <= 0.5 && volume != 0"
                      class="i-material-symbols-volume-down-rounded"
                    ></i>
                    <i
                      v-show="volume > 0.5"
                      class="i-material-symbols-volume-up-rounded"
                    ></i>
                  </ButtonIcon>
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
                <!-- 喜欢、添加到歌单功能 -->
                <div class="buttons">
                  <ButtonIcon
                    @click.native="likeATrack(currentTrack.id)"
                    title="喜欢"
                  >
                    <!-- :class="
                      store.player.isCurrentTrackLiked
                        ? 'i-material-symbols-favorite-outline-rounded'
                        : 'i-material-symbols-favorite-rounded'
                    " -->
                    <i class="i-material-symbols-favorite-rounded" />
                  </ButtonIcon>
                  <ButtonIcon @click.native="addToPlaylist" title="添加到歌单">
                    <i class="i-material-symbols-add-rounded" />
                  </ButtonIcon>
                </div>
              </div>
            </div>
            <!-- 歌曲进度条 -->
            <div class="progress-bar">
              <span>{{ formatTrackTime(curShowProgress) || "0:00" }}</span>
              <div class="slider">
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
              <span>{{ formatTrackTime(player.currentTrackDuration) }}</span>
            </div>
            <!-- 歌曲播放控制 -->
            <div class="media-controls">
              <ButtonIcon
                :title="player.repeatMode === 'one' ? '单曲循环' : '循环播放'"
                :class="{ active: player.repeatMode !== 'off' }"
                @click.native="switchRepeatMode"
              >
                <i
                  v-show="player.repeatMode !== 'one'"
                  class="i-material-symbols-repeat-rounded"
                />
                <i
                  v-show="player.repeatMode === 'one'"
                  class="i-material-symbols-repeat-one-rounded"
                />
              </ButtonIcon>
              <div class="middle">
                <ButtonIcon
                  title="上一首"
                  @click.native="player.playPrevTrack()"
                >
                  <i class="i-material-symbols-skip-previous-rounded" />
                </ButtonIcon>
                <ButtonIcon
                  id="play"
                  :title="player.playing ? '暂停' : '播放'"
                  @click.native="player.playOrPause()"
                >
                  <i
                    :class="
                      player.playing
                        ? 'i-material-symbols-pause-rounded'
                        : 'i-material-symbols-play-arrow-rounded'
                    "
                  />
                </ButtonIcon>
                <ButtonIcon title="下一首" @click.native="playNextTrack">
                  <i class="i-material-symbols-skip-next-rounded" />
                </ButtonIcon>
              </div>
              <ButtonIcon
                title="随机播放"
                :class="{ active: player.shuffle }"
                @click.native="switchShuffle"
              >
                <i class="i-material-symbols-shuffle-rounded" />
              </ButtonIcon>
              <ButtonIcon
                v-show="isShowLyricTypeSwitch"
                :title="lyricType === 'translation' ? '歌词(译)' : '歌词(音)'"
                @click.native="switchLyricType"
              >
                <span class="lyric-switch-icon">{{
                  lyricType === "translation" ? "译" : "音"
                }}</span>
              </ButtonIcon>
            </div>
          </div>
        </div>
      </div>
      <!-- 歌词相关 -->
      <div class="right-wrap">
        <transition name="slide-fade">
          <div v-show="!noLyric" ref="lyricsContainer" class="lyrics-container">
            <div id="line-1" class="line"></div>
            <div
              v-for="(line, index) in lyrics"
              :id="`line${index}`"
              :key="index"
              class="line"
              :class="{
                highlight: highlightLyricIndex === index,
              }"
              @click="clickLyricLine(line.time)"
              @dblclick="clickLyricLine(line.time, true)"
            >
              <div class="content">
                <span v-if="line.contents[0]">{{ line.contents[0] }}</span>
                <br />
                <span v-if="line.contents[1]" class="translation">{{
                  line.contents[1]
                }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- 关闭按钮 -->
      <div class="close-button" @click="store.toggleLyrics">
        <ButtonIcon>
          <i class="i-material-symbols-keyboard-arrow-down-rounded" />
        </ButtonIcon>
      </div>
    </div>
  </transition>
</template>
<style scoped lang="scss">
.lyric-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  background: var(--color-body-bg);
  display: flex;
  clip: rect(auto, auto, auto, auto);
  .no-lyric {
    .left-wrap {
      transition: all 0.5s;
      transform: translateX(27vh);
      margin-right: 0;
    }
  }
  .gradient-background {
    position: absolute;
    height: 100vh;
    width: 100vw;
  }
  .left-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin-right: 32px;
    margin-top: 24px;
    align-items: center;
    transition: all 0.5s;
    z-index: 1;

    .cover {
      position: relative;

      .cover-container {
        position: relative;
      }

      img {
        border-radius: 0.75em;
        width: 54vh;
        height: 54vh;
        user-select: none;
        object-fit: cover;
      }

      .shadow {
        position: absolute;
        top: 12px;
        height: 54vh;
        width: 54vh;
        filter: blur(16px) opacity(0.6);
        transform: scale(0.92, 0.96);
        z-index: -1;
        background-size: cover;
        border-radius: 0.75em;
      }
    }
    .controls-wrap {
      max-width: 54vh;
      margin-top: 24px;
      color: var(--color-text);
      .control-top {
        display: flex;
        justify-content: space-between;
      }
      .track-title {
        margin-top: 8px;
        font-size: 1.4rem;
        font-weight: 600;
        opacity: 0.88;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .subtitle {
        margin-top: 4px;
        font-size: 1rem;
        opacity: 0.58;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .volume-like {
        display: flex;
        justify-content: space-between;
        i {
          height: 18px;
          width: 18px;
        }
        .volume-control {
          margin: 0 10px;
          display: flex;
          align-items: center;
          .vue-slider {
            width: 84px !important;
          }
        }
      }
      .buttons {
        display: flex;
        align-items: center;

        button {
          margin: 0 0 0 4px;
        }
      }
    }

    .progress-bar {
      margin-top: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .slider {
        width: 100%;
        flex-grow: grow;
        padding: 0 10px;
      }

      span {
        font-size: 15px;
        opacity: 0.58;
        min-width: 28px;
      }
    }

    .media-controls {
      display: flex;
      justify-content: center;
      margin-top: 18px;
      align-items: center;

      button {
        margin: 0;
      }

      i {
        opacity: 0.38;
        height: 14px;
        width: 14px;
      }

      .active i {
        opacity: 0.88;
      }

      .middle {
        padding: 0 16px;
        display: flex;
        align-items: center;

        button {
          margin: 0 8px;
          padding: 2px;
        }

        i {
          width: 36px;
          height: 36px;
          opacity: 0.88;
        }
      }
    }
    .lyric-switch-icon {
      color: var(--color-text);
      font-size: 14px;
      line-height: 14px;
      opacity: 0.88;
    }
  }
  .right-wrap {
    flex: 1;
    font-weight: 600;
    color: var(--color-text);
    margin-right: 24px;
    z-index: 0;
    .lyrics-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-left: 78px;
      max-width: 460px;
      overflow-y: auto;
      transition: 0.5s;
      font-size: 28px;
      scrollbar-width: none; // firefox
      .line {
        margin: 2px 0;
        padding: 12px 18px;
        transition: 0.5s;
        border-radius: 12px;
        &:hover {
          background: var(--color-secondary-bg-for-transparent);
        }

        .content {
          transform-origin: center left;
          transform: scale(0.95);
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          user-select: none;

          span {
            opacity: 0.28;
            cursor: default;
            font-size: 1em;
            transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          span.translation {
            opacity: 0.2;
            font-size: 0.925em;
          }
        }
      }

      .line#line-1:hover {
        background: unset;
      }

      .translation {
        margin-top: 0.1em;
      }

      .highlight div.content {
        transform: scale(1);
        span {
          opacity: 0.98;
          display: inline-block;
        }

        span.translation {
          opacity: 0.65;
        }
      }
    }
    .lyrics-container .line:first-child {
      margin-top: 50vh;
    }

    .lyrics-container .line:last-child {
      margin-bottom: calc(50vh - 128px);
    }
  }
  .close-button {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 300;
    border-radius: 0.75rem;
    height: 44px;
    width: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-app-region: no-drag;

    i {
      opacity: 0.28;
      color: var(--color-text);
      height: 22px;
      width: 22px;
    }
    &:hover {
      i {
        opacity: 0.88;
      }
    }
  }
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

@media (max-aspect-ratio: 10/9) {
  .lyric-wrap .left-wrap {
    display: none;
  }
  .right-wrap .lyrics-container {
    max-width: 100%;
  }
}

@media screen and (min-width: 1200px) {
  .right-wrap .lyrics-container {
    max-width: 600px;
  }
}
</style>
