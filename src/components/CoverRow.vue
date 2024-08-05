<script setup>
import { formatNum } from "@/utils/common.js";
const props = defineProps({
  items: {
    type: Array,
  },
  type: {
    type: String,
    required: true,
  },
  columnNumber: {
    type: Number,
    default: 5,
  },
  showPlayCount: {
    type: Boolean,
    default: false,
  },
  gap: {
    type: String,
    default: "44px 24px",
  },
  subText: {
    type: String,
    default: "none",
  },
  subTextFontSize: {
    type: String,
    default: "16px",
  },
});

const rowStyles = computed(() => {
  return {
    "grid-template-columns": `repeat(${props.columnNumber}, 1fr)`,
    gap: props.gap,
  };
});

function getSubText(item) {
  const subText = {
    copywriter: item.copywriter,
    description: item.description,
    updateFrequency: item.updateFrequency,
    creator: "by " + item.creator?.nickname,
    releaseYear: new Date(item.publishTime).getFullYear(),
    appleMusic: "by Apple Music",
    artist: (() => {
      if (item.artist !== undefined && item.artist)
        return `<a href="/artist/${item.artist.id}">${item.artist.name}</a>`;
      if (item.artists !== undefined && item.artists)
        return `<a href="/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
    })(),
    "albumType+releaseYear": (() => {
      let albumType = item.type;
      if (item.type === "EP/Single") {
        albumType = item.size === 1 ? "Single" : "EP";
      } else if (item.type === "Single") {
        albumType = "Single";
      } else if (item.type === "专辑") {
        albumType = "Album";
      }
      return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
    })(),
  };
  return subText[props.subText];
}

function getImageUrl(item) {
  if (item.img1v1Url) {
    let img1v1ID = item.img1v1Url.split("/");
    img1v1ID = img1v1ID[img1v1ID.length - 1];
    if (img1v1ID === "5639395138885805.jpg") {
      return "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512";
    }
  }
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace("http://", "https://")}?param=512y512`;
}

function getTitleLink(item) {
  return `/${props.type}/${item.id}`;
}
</script>
<template>
  <div class="grid" :style="rowStyles">
    <div v-for="item in props.items" :key="item.id">
      <Cover
        :imageUrl="getImageUrl(item)"
        :id="item.id"
        :type="props.type"
      ></Cover>
      <div class="mt-8px">
        <div v-if="showPlayCount" class="flex justify-between">
          <div class="play-count">
            <i class="i-material-symbols-play-arrow-rounded" />
            {{ formatNum(item.playCount) }}
          </div>
          <div class="play-count">
            <i class="i-material-symbols-queue-music-rounded" />
            {{ formatNum(item.trackCount) }}
          </div>
        </div>
        <router-link
          :style="{ fontSize: subTextFontSize }"
          class="name"
          :class="{ 'text-center': props.type === 'artist' }"
          :to="getTitleLink(item)"
          >{{ item.name }}
        </router-link>
        <div
          v-if="props.type !== 'artist' && props.subText !== 'none'"
          class="play-count"
        >
          <span v-html="getSubText(item)"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.play-count {
  display: flex;
  align-items: center;
  color: var(--color-secondary);
  font-weight: 600;
  opacity: 0.6;
  font-size: 12px;
  span {
    font-weight: 400;
  }
}
.name {
  font-weight: 600;
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}
</style>
