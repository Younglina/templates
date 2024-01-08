<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 开通会员
-->
<script setup>
import { VIP_CHOOSES } from '@/constants/vip.js'

const chooses = VIP_CHOOSES
function redeem(t) {
  console.log(t)
  ElMessage.info('请登录后再兑换会员！')
}
function toByCode(type = 8732) {
  window.open(`${import.meta.env.VITE_BYCODEURL}?id=${type}`)
}
</script>

<template>
  <div class="pay-box">
    <div v-for="item in chooses" :key="item.name" class="pay-box-item">
      <div class="text-center c-indigo-500">
        {{ item.title }}
      </div>
      <div class="my-10px">
        <span class="mr-20px font-size-40px">¥ {{ item.price }}</span>
        <span class="font-size-16px font-400 color-#6b7280 line-through">原价：¥{{ item.originalPrice }}</span>
      </div>
      <div class="b-bottom flex justify-evenly pb-20px font-size-14px c-indigo-500">
        <span><span v-if="item.price != 0">约¥</span>{{ item.dayPrice }}<span v-if="item.price == 0">元</span>/天</span>
        <span>{{ item.gpt4 ? '' : '不' }}支持GPT4</span>
      </div>
      <div v-for="f in item.features" :key="f" class="p-6px pt-20px">
        <div :class="f.highLight ? 'c-indigo-500' : ''" class="flex items-center font-size-14px">
          <div class="i-material-symbols-check-circle-rounded mr-6px min-w-20px font-size-20px c-indigo-500" />
          <span>{{ f.text }}</span>
        </div>
      </div>
      <el-button :disabled="item.price == 0" class="mt-20px w-100%" @click="toByCode(8732)">
        购买兑换码
      </el-button>
    </div>
  </div>
  <div class="text-center">
    <div class="mb-16px mt-16px font-size-18px c-indigo-500">
      购买会员后，将兑换码填写到输入框中，点击兑换
    </div>
    <div>
      <el-input placeholder="请输入兑换码" class="mr-50px w-300px" />
      <el-button type="primary" @click="redeem('vip')">
        兑换会员
      </el-button>
      <el-button type="primary" @click="redeem('his')">
        兑换历史
      </el-button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.pay-box {
  width: 100%;
  display: flex;
  justify-content: space-evenly;

  &-item {
    border: 2px solid #d1d5db;
    height: auto;
    width: 300px;
    border-radius: 8px;
    font-size: 20px;
    padding: 20px;
    position: relative;
    font-weight: 500;
    box-sizing: border-box;
  }

  .b-bottom {
    border-bottom: 1px solid #d1d5db
  }
}
</style>
