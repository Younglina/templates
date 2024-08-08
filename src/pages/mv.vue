<script setup>
import { mvDetail, mvUrl, simiMv, likeAMV } from "@/api/mv";
import { formatNum } from "@/utils/common.js";
import Plyr from "plyr";

const videoRef = ref(null);
const route = useRoute();
const store = useMainStore();
const player = ref(null);
const { startPg, donePg } = useProgres();

onMounted(() => {
  startPg();
  let videoOptions = {
    settings: ["quality"],
    autoplay: false,
    quality: {
      default: 1080,
      options: [1080, 720, 480, 240],
    },
  };
  if (route.query.autoplay === "true") videoOptions.autoplay = true;
  player.value = new Plyr(videoRef.value, videoOptions);
  player.value.volume = store.player.volume;
  player.value.on("playing", () => {
    store.player.pause();
  });
  getData(route.params.id);
});

const mv = ref({ data: {} });
const simiMvs = ref([]);
function getData(id) {
  mvDetail(id).then((data) => {
    mv.value = data;
    let requests = data.data.brs.map((br) => {
      return mvUrl({ id, r: br.br });
    });
    Promise.all(requests).then((results) => {
      let sources = results.map((result) => {
        return {
          src: result.data.url.replace(/^http:/, "https:"),
          type: "video/mp4",
          size: result.data.r,
        };
      });
      player.value.source = {
        type: "video",
        title: mv.value.data.name,
        sources: sources,
        poster: mv.value.data.cover.replace(/^http:/, "https:"),
      };
      donePg();
    });
  });
  simiMv(id).then((data) => {
    simiMvs.value = data.mvs;
  });
}
// todo
function likeMV() {}
function openMenu() {}
</script>
<template>
  <div class="mt-24px">
    <div class="video">
      <video ref="videoRef" class="plyr"></video>
    </div>
    <div class="video-info">
      <div class="video-title">
        <router-link :to="'/artist/' + mv.data.artistId">{{
          mv.data.artistName
        }}</router-link>
        -
        {{ mv.data.name }}
        <div class="buttons">
          <ButtonIcon class="button" @click.native="likeMV">
            <div
              :class="[
                mv.subed
                  ? 'i-material-symbols-favorite-rounded'
                  : 'i-material-symbols-favorite-outline-rounded',
              ]"
            ></div>
          </ButtonIcon>
          <ButtonIcon class="button" @click.native="openMenu">
            <div class="i-material-symbols-more-horiz"></div>
          </ButtonIcon>
        </div>
      </div>
      <div class="info">
        {{ formatNum(mv.data.playCount) }} Views ·
        {{ mv.data.publishTime }}
      </div>
    </div>
    <div class="more-video">
      <div class="section-title">更多视频</div>
      <MvList :dataList="simiMvs" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.video {
  --plyr-color-main: #335eea;
  --plyr-control-radius: 8px;
}

.video {
  border-radius: 16px;
  background: transparent;
  overflow: hidden;
  max-height: 100vh;
}
.video-info {
  margin-top: 12px;
  color: var(--color-text);
  .video-title {
    font-size: 24px;
    font-weight: 600;
  }
  .artist {
    font-size: 14px;
    opacity: 0.88;
    margin-top: 2px;
    font-weight: 600;
  }
  .info {
    font-size: 12px;
    opacity: 0.68;
    margin-top: 12px;
  }
}

.more-video {
  margin-top: 48px;
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    opacity: 0.88;
    margin-bottom: 12px;
  }
}

.buttons {
  display: inline-block;
  margin-left: 8px;
  .button {
    display: inline-block;
  }
}
.button-icon {
  > div {
    height: 18px;
    width: 18px;
    color: var(--color-primary);
  }
}
</style>
