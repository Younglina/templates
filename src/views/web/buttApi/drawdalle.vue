<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 15:02:31
 * @Description: MidJourney
-->
<script setup>
import defaultImg from '@/assets/images/sunflower.jpg'
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
    <div class="flex flex-col right-box">
      <div class="option-box flex-1">
        <div class="font-size-20px mb-20px">AI绘画🎨</div>
        <el-input class="mb-20px" v-model="imgStyles.prompt" type="textarea"
          placeholder="已升级为最新的dalle3模型。请输入图片描述，支持中文和英文输入"></el-input>
        <div>
          <span class="mr-12px">示例：sunflowers, by Van Gogh</span>
        </div>
        <div>
          <div class="flex items-center">
            <span class="subtitle">图片风格</span>
            <el-tooltip placement="right">
              <template #content>vivid：超现实和戏剧性的图像，<br>natural：更自然</template>
              <div class="i-material-symbols-help-outline"></div>
            </el-tooltip>
          </div>
          <div class="flex items-center mb-12px">
            <el-radio-group v-model="imgStyles.style" size="small">
              <el-radio-button label="vivid" />
              <el-radio-button label="natural" />
            </el-radio-group>
          </div>
        </div>
        <div>
          <div class="flex items-center">
            <span class="subtitle">图片质量</span>
            <el-tooltip placement="right">
              <template #content> standard：生成速度最快，<br>hd：清晰度最高 </template>
              <div class="i-material-symbols-help-outline"></div>
            </el-tooltip>
          </div>
          <el-radio-group v-model="imgStyles.quality" size="small">
            <el-radio-button label="standard" />
            <el-radio-button label="hd" />
          </el-radio-group>
        </div>
        <div>
          <div class="flex items-center">
            <span class="subtitle">图片分辨率</span>
          </div>
          <el-radio-group v-model="imgStyles.size" size="small">
            <el-radio-button label="1024x1024" />
            <el-radio-button label="1024x1792" />
            <el-radio-button label="1792x1024" />
          </el-radio-group>
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
      <div class="res-box"
        :style="{ 'background-color': imgSrc ? 'white' : '#f5f5f8', 'border-width': imgSrc ? '0' : '2' }"
        v-loading="imgLoading" element-loading-text="图片生成中">
        <img class="img-box" :src="imgSrc ? imgSrc : defaultImg" alt="">
        <div class="font-size-20px">AI绘画🎨</div>
        <div class="color-#6b7280">在左侧输入图片描述，创造你的绘画作品</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'>
.right-box {
  box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
}

.option-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 500px;
  overflow-y: auto;
  padding: 16px 20px;
  position: relative;
  box-sizing: border-box;
  border-bottom: 1px solid var(--el-border-color);
}

.show-box {
  flex: 1 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  background-color: #f5f5f8;

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