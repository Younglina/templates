<script setup>
import { VIP_CHOOSES } from '@/constants/vip.js'
const chooses = VIP_CHOOSES
const redeem = (t) => {
  console.log(t)
  ElMessage.info('请登录后再兑换会员！')
}
const toByCode = (type=8732) => {
  console.log();
  window.open(`${import.meta.env.VITE_BYCODEURL}?id=${type}`)
}
</script>
<template>
  <div class="pay-box">
    <div v-for="item in chooses" :key="item.name" class="pay-box-item">
      <div class="c-indigo-500 text-center">{{ item.title }}</div>
      <div class="mt-10px mb-10px">
        <span class="font-size-40px mr-20px">¥ {{ item.price }}</span>
        <span class="font-size-16px font-400 line-through color-#6b7280">原价：¥{{ item.originalPrice }}</span>
      </div>
      <div class="c-indigo-500 flex justify-evenly pb-20px b-bottom font-size-14px">
        <span><span v-if="item.price != 0">约¥</span>{{ item.dayPrice }}<span v-if="item.price == 0">元</span>/天</span>
        <span>{{ item.gpt4 ? '' : '不' }}支持GPT4</span>
      </div>
      <div v-for="f in item.features" :key="f" class="p-6px pt-20px">
        <div :class="f.highLight ? 'c-indigo-500' : ''" class="flex items-center font-size-14px">
          <div class="i-material-symbols-check-circle-rounded c-indigo-500 mr-6px font-size-20px min-w-20px"></div>
          <span>{{ f.text }}</span>
        </div>
      </div>
      <el-button :disabled="item.price==0" class="w-100% mt-20px" @click="toByCode(8732)">购买兑换码</el-button>
    </div>
  </div>
  <div class="text-center">
    <div class="c-indigo-500 mt-16px mb-16px font-size-18px">购买会员后，将兑换码填写到输入框中，点击兑换</div>
    <div>
      <el-input placeholder="请输入兑换码" class="w-300px mr-50px"></el-input>
      <el-button @click="redeem('vip')" type="primary">兑换会员</el-button>
      <el-button @click="redeem('his')" type="primary">兑换历史</el-button>
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
  .b-bottom{
    border-bottom: 1px solid #d1d5db
  }
}
</style>