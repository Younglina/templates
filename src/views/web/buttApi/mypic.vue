<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-09 10:55:24
 * @Description: 我的作品
-->
<script setup>
const route = useRoute()
const params = reactive({
  pageNum: 1,
  pageSize: 16
})
const imgData = ref([])
const showViewer = ref(false)
const urlList = ref([])
const imgTotal = ref(0)
watch(route, (v) => {
  getPageData(v.name)
})
onMounted(() => {
  getPageData(route.name)
})

function getPageData(name) {
  let url = '/v1/image/his'
  if (name === 'mjshowcase') {
    url = '/v1/image/square'
  }
  useHttp.get(url, params).then(res => {
    imgData.value = res.data
    imgTotal.value = res.total
  })
}

function handleShow(item) {
  urlList.value = item.urls.bigImg
  showViewer.value = true
}
</script>
<template>
  <div class="my-draw flex flex-col justify-start items-center pb-20px">
    <div class="flex w-100% my-16px">
      <div class="imgs-box">
        <div v-for="(item, idx) in imgData" class="imgs-box-item" :key="idx">
          <el-image style="width: 260px" :src="item.urls.smallImg[0]" lazy :preview-src-list="item.urls.bigImg"
            fit="cover" />
          <el-tooltip effect="light" popper-class="p-20px">
            <template #content>
              <div>
                <div class="font-600 mb-8px pb-10px" style="border-bottom: 1px solid var(--el-border-color);">图片详情</div>
                <div>
                  <div>模型：{{ item.model }}</div>
                  <div class="py-10px">尺寸：{{ item.size }}</div>
                  <div>提示语：{{ item.prompt }}</div>
                </div>
              </div>
            </template>
            <div class="img-mask" @click="handleShow(item)">
              <div class="i-material-symbols-visibility-outline"></div>
              <div>预览</div>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-pagination background layout="prev, pager, next" :page-size="16" :pager-count="5" :total="imgTotal" />
    <el-image-viewer v-if="showViewer" :url-list="urlList" @close="showViewer = false"></el-image-viewer>
  </div>
</template>
<style scoped lang='scss'>
.imgs-box {
  width: calc(100% - 32px);
  border-radius: 8px;
  margin: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .15);
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  flex: 1 1;

  &-item {
    width: 260px;
    height: 260px;
    margin: 10px;
    position: relative;

    &:hover {
      .img-mask {
        opacity: 1;
      }
    }

    :deep(.el-image img) {
      width: 100%;
      height: auto;
      border-radius: 3%;
    }

    .img-mask {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
}
</style>