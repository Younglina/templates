<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-03-05 13:57:15
 * @Description: 随机音乐 从热榜前50随机读取
-->
<script setup>
import { getPlaylistDetail } from '@/api/playlist'
import { randomNum } from '@/utils/common'
import * as Vibrant from 'node-vibrant/dist/vibrant.worker.min.js';
import Color from 'color';

import useStore from '@/store'

const player = useStore.player
const randomList = ref([])
const idx = ref(0)
const track = ref({ ar: [] })
const background = ref('')
const nextTrackCover = ref('')
const isPlaying = ref(false)
getPlaylistDetail(19723756).then(res => {
  const ts = res.playlist.tracks.slice(0, 50)
  for (let i = ts.length - 1; i >= 0; i--) {
    const random = randomNum(0, i);
    [ts[i], ts[random]] = [ts[random], ts[i]]
  }
  randomList.value = ts
  track.value = ts[0]
  getColor()
})
function getColor() {
  const cover = `${track.value.al.picUrl.replace(
    'http://',
    'https://'
  )}?param=512y512`;
  Vibrant.from(cover, { colorCount: 1 })
    .getPalette()
    .then(palette => {
      const color = Color.rgb(palette.Vibrant._rgb)
        .darken(0.1)
        .rgb()
        .string();
      const color2 = Color.rgb(palette.Vibrant._rgb)
        .lighten(0.28)
        .rotate(-30)
        .rgb()
        .string();
      background.value = `linear-gradient(to top left, ${color}, ${color2})`;
    });
}

function play() {
  console.log('play')
}

function next() {
  console.log(idx.value, ++idx.value)
  track.value = randomList.value[++idx.value]
  nextTrackCover.value = `${track.value?.al?.picUrl.replace(
    'http://',
    'https://'
  )}?param=512y512`;
  console.log(randomList.value)
}
</script>
<template>
  <div class="fm" :style="{ background }" data-theme="dark">
    <img :src="nextTrackCover" style="display: none" loading="lazy" />
    <img class="cover" :src="track.al && track.al.picUrl" loading="lazy" />
    <div class="right-part">
      <div class="info">
        <div class="title">{{ track.name }}</div>
        <div class="artist">
          <ArtistsInLine :artists="track.ar" />
        </div>
      </div>
      <div class="controls">
        <div class="buttons">
          <button-icon :title="isPlaying ? '暂停' : '播放'" class="play" @click.native="play">
            <div
              :class="isPlaying ? 'i-material-symbols-pause-outline-rounded' : 'i-material-symbols-play-arrow-rounded'" />
          </button-icon>
          <button-icon title="下一首" @click.native="next">
            <div class="i-material-symbols-skip-next-outline-rounded" />
          </button-icon>
        </div>
        <div class="card-name">
          <div class="i-material-symbols-shuffle-outline-rounded text-20px mr-6px" />随机音乐
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.fm {
  padding: 1rem;
  background: var(--color-secondary-bg);
  border-radius: 1rem;
  display: flex;
  height: 198px;
  box-sizing: border-box;
}

.cover {
  height: 100%;
  clip-path: border-box;
  border-radius: 0.75rem;
  margin-right: 1.2rem;
  cursor: pointer;
  user-select: none;
}

.right-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-text);
  width: 100%;

  .title {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .artist {
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: -0.4rem;

    .buttons {
      display: flex;
    }

    .button-icon {
      margin: 0 8px 0 0;

      >div {
        color: var(--color-text);
        font-size: 32px;
      }
    }

    .card-name {
      font-size: 1rem;
      opacity: 0.18;
      display: flex;
      align-items: center;
      font-weight: 600;
      user-select: none;
    }
  }
}
</style>