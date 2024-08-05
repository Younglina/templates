<script setup>
const props = defineProps({
  mvs: Array,
  subtitle: {
    type: String,
    default: "artist",
  },
  withoutPadding: { type: Boolean, default: false },
});

function getUrl(mv) {
  let url = mv.imgurl16v9 ?? mv.cover ?? mv.coverUrl;
  return url.replace(/^http:/, "https:") + "?param=464y260";
}
function getID(mv) {
  return mv.id || mv.vid;
}
function getSubtitle(mv) {
  if (props.subtitle === "artist") {
    let artistName = "null";
    let artistID = 0;
    if (mv.artistName !== undefined) {
      artistName = mv.artistName;
      artistID = mv.artistId;
    } else if (mv.creator !== undefined) {
      artistName = mv.creator[0].userName;
      artistID = mv.creator[0].userId;
    }
    return `<a href="/artist/${artistID}">${artistName}</a>`;
  } else if (props.subtitle === "publishTime") {
    return mv.publishTime;
  }
}
function goToMv() {}
</script>
<template>
  <div class="mv-list" :class="{ 'without-padding': withoutPadding }">
    <div v-for="mv in props.mvs" :key="getID(mv)" class="mv">
      <div class="cover" @click="goToMv(getID(mv))">
        <img :src="getUrl(mv)" loading="lazy" />
        <div
          class="shadow"
          :style="{ background: 'url(' + getUrl(mv) + ')' }"
        ></div>
      </div>
      <div class="info">
        <div class="title">
          <router-link :to="'/mv/' + getID(mv)">{{
            mv.name || mv.title
          }}</router-link>
        </div>
        <div class="artist" v-html="getSubtitle(mv)"></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.mv-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 36px 24px;
  padding: var(--main-content-padding);
}
.mv {
  color: var(--color-text);
  &:hover {
    .shadow {
      display: block;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.88;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  .artist {
    font-size: 12px;
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}

.cover {
  position: relative;
  transition: transform 0.3s;
  &:hover {
    cursor: pointer;
  }
}
img {
  border-radius: 0.75em;
  width: 100%;
  user-select: none;
}
.shadow {
  display: none;
  position: absolute;
  top: 6px;
  height: 100%;
  width: 100%;
  filter: blur(16px) opacity(0.4);
  transform: scale(0.9, 0.9);
  z-index: -1;
  background-size: cover;
  border-radius: 0.75em;
}
</style>
