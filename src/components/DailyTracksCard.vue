<script setup>
import useStore from '@/store';
import { dailyRecommendTracks } from '@/api/playlist';
import { isAccountLoggedIn } from '@/utils/auth';
const defaultCovers = [
  'https://p2.music.126.net/0-Ybpa8FrDfRgKYCTJD8Xg==/109951164796696795.jpg',
  'https://p2.music.126.net/QxJA2mr4hhb9DZyucIOIQw==/109951165422200291.jpg',
  'https://p1.music.126.net/AhYP9TET8l-VSGOpWAKZXw==/109951165134386387.jpg',
];

const store = useStore()
if (store.dailyTracks.length === 0) loadDailyTracks()

const coverUrl = computed(() => store.dailyTracks[0]?.al.picUrl || defaultCovers[1])

function loadDailyTracks() {
  if (!isAccountLoggedIn()) return
  dailyRecommendTracks().then(res => {
    store.updateDailyTracks(res.data.dailySongs)
  })
}
function playDailyTracks() {
  if (!isAccountLoggedIn()) {
    return ElMessage({
      message: '请先登录登录！',
      type: 'warning',
    })
  }
  let trackIDs = store.dailyTracks.map(t => t.id);
  store.player.replacePlaylist(
    trackIDs,
    '/daily/songs',
    'url',
    store.dailyTracks[0].id
  );
}
</script>
<template>
  <div class="daily-recommend-card" @click="goToDailyTracks">
    <img :src="coverUrl" loading="lazy" />
    <div class="container">
      <div class="title-box">
        <div class="title">
          <span>每</span>
          <span>日</span>
          <span>推</span>
          <span>荐</span>
        </div>
      </div>
    </div>
    <button class="play-button absolute right-1.6rem bottom-1.4rem w-44px h-44px" @click.stop="playDailyTracks">
      <div class="i-material-symbols-play-arrow-rounded w-full h-full"></div>
    </button>
  </div>
</template>
<style scoped lang='scss'>
.daily-recommend-card {
  border-radius: 1rem;
  height: 198px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  animation: move 38s infinite;
  animation-direction: alternate;
  z-index: -1;
}

.container {
  background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.28));
  height: 198px;
  width: 50%;
  display: flex;
  align-items: center;
  border-radius: 0.94rem;
}

.title-box {
  height: 148px;
  width: 148px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 25px;
  user-select: none;

  .title {
    height: 100%;
    width: 100%;
    font-weight: 600;
    font-size: 64px;
    line-height: 48px;
    opacity: 0.96;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    place-items: center;
  }
}

@keyframes move {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}
</style>