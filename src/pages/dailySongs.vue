<script setup>
import { randomNum } from "@/utils/common.js";
const store = useMainStore();
</script>

<template>
  <div>
    <div class="special-playlist">
      <div :class="['title', `gradient${randomNum(0, 4)}`]">每日歌曲推荐</div>
      <div class="subtitle">根据你的音乐口味生成 · 每天6:00更新</div>
    </div>

    <TrackList
      :data-list="store.dailySongs"
      type="playlist"
      dbclick-track-func="dailyTracks"
    />
  </div>
</template>

<style lang="scss" scoped>
.special-playlist {
  margin-top: 92px;
  margin-bottom: 68px;
  border-radius: 1.25em;
  text-align: center;

  @keyframes letterSpacing4 {
    from {
      letter-spacing: 0px;
    }

    to {
      letter-spacing: 4px;
    }
  }

  @keyframes letterSpacing1 {
    from {
      letter-spacing: 0px;
    }

    to {
      letter-spacing: 1px;
    }
  }

  .title {
    font-size: 84px;
    line-height: 1.05;
    font-weight: 700;
    text-transform: uppercase;

    letter-spacing: 4px;
    animation-duration: 0.8s;
    animation-name: letterSpacing4;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    img {
      height: 78px;
      border-radius: 0.125em;
      margin-right: 24px;
    }
  }
  .subtitle {
    font-size: 18px;
    letter-spacing: 1px;
    margin: 28px 0 54px 0;
    animation-duration: 0.8s;
    animation-name: letterSpacing1;
    text-transform: uppercase;
    color: var(--color-text);
  }
  .buttons {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    button {
      margin-right: 16px;
    }
  }
}

.gradient0 {
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
}
.gradient1 {
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}
.gradient2 {
  background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
}
.gradient3 {
  background-image: linear-gradient(
    to right,
    #eea2a2 0%,
    #bbc1bf 19%,
    #57c6e1 42%,
    #b49fda 79%,
    #7ac5d8 100%
  );
}
</style>
