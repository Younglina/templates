<script setup>
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  fixedSize: {
    type: Number,
    default: 0,
  },
  clickCoverToPlay: {
    type: Boolean,
    default: false,
  },
  alwaysShowShadow: {
    type: Boolean,
    default: false,
  },
  tracks: {
    type: Array,
    default: () => [],
  },
});

const imageStyles = computed(() => {
  const styles = {};
  if (props.fixedSize !== 0) {
    styles.width = `${props.fixedSize}px`;
    styles.height = `${props.fixedSize}px`;
  }
  if (props.type === "artist") styles.borderRadius = "50%";
  return styles;
});

const shadowStyles = computed(() => {
  const styles = {};
  styles.backgroundImage = `url(${props.imageUrl})`;
  if (props.type === "artist") styles.borderRadius = "50%";
  if (props.alwaysShowShadow) styles.display = "block";
  return styles;
});
function play() {}

const router = useRouter();
function goTo() {
  if (props.id === -1) return router.push(`/daily/songs`);
  router.push(`/${props.type}/${props.id}`);
}
</script>

<template>
  <div class="cover" @click="clickCoverToPlay ? play() : goTo()">
    <div v-if="props.id === -1" class="daily-tracks">
      <p v-for="(item, idx) in props.tracks.slice(0, 5)">
        {{ idx + 1 }}. {{ item.name }}
      </p>
    </div>
    <div class="shade">
      <button
        :class="['play-button', props.id === -1 && 'daily-play']"
        @click.stop="play()"
      >
        <div class="i-material-symbols-play-arrow-rounded size-32px" />
      </button>
    </div>
    <img :src="props.imageUrl" :style="imageStyles" loading="lazy" />
    <div class="shadow" :style="shadowStyles" />
  </div>
</template>

<style scoped lang="scss">
.cover {
  position: relative;
  cursor: pointer;
  &:hover {
    .play-button {
      opacity: 1;
    }
    .daily-tracks {
      height: auto;
      opacity: 1;
    }
    .shadow {
      display: block;
    }
  }
  .shade {
    position: absolute;
    top: 0;
    height: calc(100% - 3px);
    width: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .play-button {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.08);
    height: 22%;
    width: 22%;
    border-radius: 50%;
    cursor: default;
    transition: 0.2s;
    opacity: 0;
    &:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    &:active {
      transform: scale(0.94);
    }
  }
  img {
    border-radius: 0.75em;
    width: 100%;
    user-select: none;
    aspect-ratio: 1 / 1;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  .shadow {
    position: absolute;
    display: none;
    bottom: -12px;
    height: 100%;
    width: 100%;
    filter: blur(14px) opacity(0.5);
    transform: scale(0.92, 0.96);
    z-index: -1;
    background-size: cover;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
  }
  .daily-tracks {
    position: absolute;
    bottom: 12px;
    left: 1px;
    right: 0;
    height: 0px;
    opacity: 0;
    overflow: hidden;
    padding: 2px 12px;
    color: var(--color-secondary);
    backdrop-filter: blur(6px);
    background-color: var(--color-navbar-bg);
    box-shadow: 0 0px 14px 24px var(--color-navbar-bg);
    transition: all 0.2s;
    p + p {
      max-width: calc(100% - 22% - 30px);
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .daily-play {
    position: absolute;
    bottom: 18px;
    right: 8px;
  }
}
</style>
