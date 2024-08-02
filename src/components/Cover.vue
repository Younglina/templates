<script setup>
const props = defineProps({
  imageUrl: {
    type: String,
  },
  fixedSize: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
  },
});

const imageStyles = computed(() => {
  let styles = {};
  if (props.fixedSize !== 0) {
    styles.width = props.fixedSize + "px";
    styles.height = props.fixedSize + "px";
  }
  if (props.type === "artist") styles.borderRadius = "50%";
  return styles;
});

const shadowStyles = computed(() => {
  let styles = {};
  styles.backgroundImage = `url(${props.imageUrl})`;
  if (props.type === "artist") styles.borderRadius = "50%";
  return styles;
});
function play() {}
</script>
<template>
  <div class="cover">
    <div class="shade">
      <button class="play-button" @click.stop="play()">
        <div class="i-material-symbols-play-arrow-rounded size-32px" />
      </button>
    </div>
    <img :src="props.imageUrl" :style="imageStyles" loading="lazy" />
    <div class="shadow" :style="shadowStyles"></div>
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
}
</style>
