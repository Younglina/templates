<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  columns: { type: Number, default: 5 },
  gap: { type: String, default: '44px 24px' },
})

const rowStyles = computed(() => {
  return {
    'grid-template-columns': `repeat(${props.columns}, 1fr)`,
    gap: props.gap,
  };
})

function getImageUrl(item) {
  if (item.img1v1Url) {
    let img1v1ID = item.img1v1Url.split('/');
    img1v1ID = img1v1ID[img1v1ID.length - 1];
    if (img1v1ID === '5639395138885805.jpg') {
      // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
      return 'https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512';
    }
  }
  let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
  return `${img?.replace('http://', 'https://')}?param=512y512`;
}
</script>
<template>
  <div class="cover-row grid" :style="rowStyles">
    <div v-for="item in items" :key="item.id">
      <Cover :image-url="getImageUrl(item)" />
      <div class="mt-8px">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'></style>