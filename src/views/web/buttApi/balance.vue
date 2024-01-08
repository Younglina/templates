<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 09:24:28
 * @Description: 余额/充值
-->
<script setup>
const data = reactive({
  totalPay: '0.0000',
  balance: '0.0000',
  loading: false
})
const cardCode = ref('')
// useHttp.get('/balance').then((res) => {
//   const { balance, total } = res.data
//   data.balance = balance
//   data.totalPay = totalPay
// })

const payLoading = ref(false)
function handlePay() {
  payLoading.value = true
  // useHttp.get('/pay').then((res) => {
  //   data.balance = balance
  //   data.totalPay = totalPay
  //    payLoading.value = false
  // })
  setTimeout(() => {
    payLoading.value = false
    ElMessage({
      type: 'error',
      message: '无效兑换码！',
    })
  }, 1000)
}
</script>
<template>
  <div class="balance">
    <div v-loading="data.loading" class="flex h-60px my-20px">
      <div class="flex flex-col justify-between flex-0.5">
        <span class="c-gray-400 font-size-14px">总充值金额</span>
        <span class=" font-size-24px">{{ data.totalPay }}</span>
      </div>
      <div class="flex flex-col justify-between">
        <span class="c-gray-400 font-size-14px">余额</span>
        <span class=" font-size-24px">{{ data.balance }}</span>
      </div>
    </div>
    <h2>充值</h2>
    <p>充值我们使用了卡密系统，卡密的格式是随机生成的 uuidv4 字符串。</p>
    <p>请先购买卡密: <el-button type="primary" @click="toByCode()">购买卡密</el-button> (不要翻墙，翻墙会打不开)</p>
    <p>从发卡网购买卡密之后，输入到以下输入框中点击充值即可</p>
    <div class="flex">
      <el-input v-model="cardCode" placeholder="请输入购买的卡密"></el-input>
      <el-button type="primary" v-loading="payLoading" @click="handlePay()">充值</el-button>
    </div>
  </div>
</template>
<style scoped lang='scss'></style>