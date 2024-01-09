<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 10:42:04
 * @Description: 充值记录
-->
<script setup>
const loading = ref(true)
const tableInfo = reactive({
  columns: [
    { prop: 'time', label: '兑换时间', minWidth: '100px' },
    { prop: 'amount', label: '充值金额', minWidth: '100px' },
    { prop: 'code', label: '兑换码' },
    { prop: 'codeAmount', label: '兑换码价格', minWidth: '100px' },
  ],
  data: [{ amount: 'amount', codeAmount: 'codeAmount', code: 'code', time: 'time' }],
})
setTimeout(() => {
  loading.value = false
}, 1000)
</script>
<template>
  <div class="balanceHis">
    <the-table :tableInfo="tableInfo" :loading="loading"></the-table>
  </div>
</template>
<style scoped lang='scss'></style>