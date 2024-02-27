<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-02-27 16:17:15
 * @Description: 
-->
<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String, required: true },
  fixedSize: { type: Number, default: 0 },
  playButtonSize: { type: Number, default: 22 },
  coverHover: { type: Boolean, default: true },
  alwaysShowPlayButton: { type: Boolean, default: true },
  alwaysShowShadow: { type: Boolean, default: false },
  clickCoverToPlay: { type: Boolean, default: false },
  shadowMargin: { type: Number, default: 12 },
  radius: { type: Number, default: 12 },
})

const focus = ref(false)
const imageStyles = computed(() => {
  let styles = {};
  if (props.fixedSize !== 0) {
    styles.width = props.fixedSize + 'px';
    styles.height = props.fixedSize + 'px';
  }
  if (props.type === 'artist') styles.borderRadius = '50%';
  return styles;
});
const playButtonStyles = computed(() => {
  let styles = {};
  styles.width = props.playButtonSize + '%';
  styles.height = props.playButtonSize + '%';
  return styles;
});
const shadowStyles = computed(() => {
  let styles = {};
  styles.backgroundImage = `url(${props.imageUrl})`;
  if (props.type === 'artist') styles.borderRadius = '50%';
  return styles;
});
</script>
<template>
  <div class="cover relative" :class="{ 'cover-hover': coverHover }" @mouseover="focus = true"
    @mouseleave="focus = false">
    <div class="relative">
      <div class="shade">
        <button v-show="focus" class="play-button" :style="playButtonStyles">
          <div class="i-material-symbols-play-arrow-rounded w-full h-full"></div>
        </button>
      </div>
      <img :src="imageUrl" :style="imageStyles" loading="lazy" />
      <transition v-if="coverHover || alwaysShowShadow" name="fade">
        <div v-show="focus || alwaysShowShadow" class="shadow" :style="shadowStyles"></div>
      </transition>
    </div>
  </div>
</template>
<style scoped lang='scss'>
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

img {
  border-radius: 0.75em;
  width: 100%;
  user-select: none;
  aspect-ratio: 1 / 1;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.cover-hover {
  &:hover {
    cursor: pointer;
    /* transform: scale(1.02); */
  }
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

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }

  &:active {
    transform: scale(0.94);
  }
}

.shadow {
  position: absolute;
  top: 12px;
  height: 100%;
  width: 100%;
  filter: blur(16px) opacity(0.6);
  transform: scale(0.92, 0.96);
  z-index: -1;
  background-size: cover;
  border-radius: 0.75em;
  aspect-ratio: 1 / 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>