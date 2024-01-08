<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 10:42:04
 * @Description: 消耗
-->
<script setup>
const loading = ref(true)
const tableInfo = reactive({
  columns: [
    { prop: 'time', label: '消耗时间' },
    { prop: 'totalCost', label: '总消耗金额(CNY)', width: '110px' },
    { prop: 'gpt35Cost', label: 'GPT3.5消耗金额(CNY)', width: '140px' },
    { prop: 'gpt40Cost', label: 'GPT4消耗金额(CNY)', width: '130px' },
    { prop: 'gpt4TurboCost', label: 'GPT4-TURBO消耗金额(CNY)', width: '180px' },
    { prop: 'dalleCost', label: 'dalle消耗金额(CNY)', width: '120px' },
    { prop: 'costInfo', label: '消耗详情' },
  ],
  data: [{ totalCost: 'totalCost', gpt35Cost: 'gpt35Cost', gpt40Cost: 'gpt40Cost', gpt4TurboCost: 'gpt4TurboCost', dalleCost: 'dalleCost', costInfo: 'costInfo', time: 'time' }],
})
setTimeout(() => {
  loading.value = false
}, 1000)
</script>
<template>
  <div class="costHis">
    <the-table :tableInfo="tableInfo" :loading="loading"></the-table>
  </div>
</template>
<style scoped lang='scss'></style>