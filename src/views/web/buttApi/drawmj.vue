<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 15:02:31
 * @Description: MidJourney
-->
<script setup>
import defaultImg from '@/assets/images/mjbg.jpeg'
const imgSrc = ref('')
const imgLoading = ref(false)
const imgStyles = reactive({ style: 'vivid', quality: 'standard', size: '1024x1024', prompt: '' })
async function handleStart() {
  ElMessage({
    type: 'info',
    message: '图片生成中'
  })
  imgLoading.value = true
  if (!imgStyles.prompt) {
    imgStyles.prompt = 'sunflowers, by Van Gogh'
  }
  console.log(imgStyles)
  // useHttp.get('/drawmj').then((res) => {
  await sleep()
  ElMessage({
    type: 'success',
    message: '生成成功'
  })
  imgLoading.value = false
  // imgSrc.value = res.data
  // })
}
</script>
<template>
  <div class="flex">
    <div class="flex flex-col">
      <div class="option-box flex-1">
        <div class="font-size-20px mb-20px">AI绘画🎨</div>
        <el-input class="mb-20px" type="textarea" placeholder="请输入图片的描述，支持中文和英文输入"></el-input>
        <div>
          <span class="mr-12px">示例：宫崎骏风格的天空之城</span>
          <span>beautiful pixar character, red hair</span>
        </div>
        <div>
          <div class="flex items-center">
            <span class="subtitle">原图绘制</span>
            <el-tooltip placement="right">
              <template #content>选取你喜欢的图片进行单张高清绘制</template>
              <div class="i-material-symbols-help-outline"></div>
            </el-tooltip>
          </div>
          <div class="flex items-center mb-12px">
            <div v-for="item in 4" :key="item" class="origin-item">图{{ item }}</div>
          </div>
        </div>
        <div>
          <div class="flex items-center">
            <span class="subtitle">创意发散</span>
            <el-tooltip placement="right">
              <template #content> 选取你喜欢的图片，再绘制四张类似风格的图片，创意发散每组图只能使用一次 </template>
              <div class="i-material-symbols-help-outline"></div>
            </el-tooltip>
          </div>
          <div class="flex items-center mb-12px">
            <div v-for="item in 4" :key="item" class="origin-item">图{{ item }}</div>
          </div>
        </div>
        <div>
          <div class="flex items-center">
            <span class="subtitle">使用说明</span>
            <el-tooltip placement="right">
              <template #content>使用说明<br>
                1、我们针对中文promot做了优化，支持中文输入<br>
                2、学习英文promot的技巧可以获得更好的效果<br>
                3、MidJourney模型出图较慢，可能在2-5分钟不等，请耐心等待<br>
                4、MidJourney有并发限制，可能会提示您当前画图需要排队<br>
                5、MidJourney偶尔有出图失败的现象，出图失败不会扣除您的使用次数<br>
                6、如果绘画尚未完成时刷新或者关闭页面，绘画结果会在我的作品中保存</template>
              <div class="i-material-symbols-help-outline"></div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center py-20px">
        <div class="flex justify-evenly pb-12px">
          <div class="flex items-center">
            <star />消耗1次（共0次）
          </div>
          <div>
            <el-tooltip placement="top">
              <template
                #content>本站服务处于前沿探索阶段，您应当合法合规使用本服务，并承担由此产生的所有责任。本服务生成的作品仅供个人学习交流使用，不可用于商业用途，本站对您的使用不做保证且不承担任何责任。</template>
              <div class="flex items-center">
                <div class="i-material-symbols-info-outline"></div>
                <span>免责声明</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <el-button class="generate-btn w-60% mx-auto" @click="handleStart">开始生成</el-button>
      </div>
    </div>
    <div class="show-box">
      <div class="res-box" v-loading="imgLoading"
        :style="{ 'background-color': imgSrc ? 'white' : '#f5f5f8', 'border-width': imgSrc ? '0' : '2' }">
        <img class="img-box" :src="imgSrc ? imgSrc : defaultImg" element-loading-text="图片生成中">
        <div class="font-size-20px">AI绘画🎨</div>
        <div class="color-#6b7280">在左侧输入图片描述，创造你的绘画作品</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'>
.option-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 500px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  overflow-y: auto;
  padding: 16px 20px;
  position: relative;
  box-sizing: border-box;
}

.show-box {
  flex: 1 1;
  background-color: #f5f5f8;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;

  .res-box {
    border: 2px dashed #a5a9b1;
    width: 85%;
    height: 85%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .img-box {
    width: 256px;
    height: 256px;
    border-radius: 8px;
    margin: 20px;
    cursor: pointer;
  }

}

.generate-btn {
  color: var(--el-color-white);
  background: linear-gradient(90deg, #2254f4 -3.2%, #43bbff), linear-gradient(88.33deg, #2254f4, #96f8f2 97.36%), linear-gradient(0deg, #2254f4, #2254f4), radial-gradient(108.96% 1095.9% at 2.35% 7.1%, #2254f4 0, #7cdec3 81.45%, #cbf784 96.88%);
}

.origin-item {
  border-radius: 6px;
  width: 80px;
  height: 26px;
  color: #fff;
  font-size: 14px;
  margin-right: 16px;
  border: none;
  cursor: not-allowed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d7d2d2;
}

.subtitle {
  font-size: 16px;
  font-weight: 500;
  margin: 12px 0;
  margin-right: 4px;
}
</style>