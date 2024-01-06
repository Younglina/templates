<script setup>
const chooses = [
  {
    title: '给程序员小哥买杯咖啡', price: '0', originalPrice: '30', dayPrice: '0', gpt4: false,
    features: [
      { text: '仅支持GPT3.5(16K)模型' },
      { text: '限制提问次数88次/天，字数不限' },
      { text: '5次普通AI绘画', highLight: true },
      { text: '注册即可享受', highLight: true },
    ],
  },
  {
    title: '周会员', price: '39', originalPrice: '49', dayPrice: '5.57', gpt4: false,
    features: [
      { text: '可以使用7天', },
      { text: '支持GPT3.5(16K)、GPT4和GPT4-TRUBO模型', highLight: true },
      { text: 'GPT3.5(16K) 提问次数200次/天，字数不限', },
      { text: 'GPT4和GPT4-TRUBO提问次数不限，限制总字数4万字', highLight: true },
      { text: '15次普通AI绘画', highLight: true },
      { text: '10次MidJourney绘画', highLight: true },
    ],
  },
  {
    title: '月会员', price: '49', originalPrice: '69', dayPrice: '1.63', gpt4: false,
    features: [
      { text: '可以使用一个月', },
      { text: '支持GPT3.5(16K)、GPT4和GPT4-TRUBO模型', highLight: true },
      { text: 'GPT3.5(16K) 提问次数250次/天，字数不限', },
      { text: 'GPT4和GPT4-TRUBO提问次数不限，限制总字数7万字', highLight: true },
      { text: '20次普通AI绘画', highLight: true },
      { text: '15次MidJourney绘画', highLight: true },
    ],
  },
  {
    title: '季度会员', price: '99', originalPrice: '159', dayPrice: '1.10', gpt4: false,
    features: [
      { text: '可以使用三个月', },
      { text: '支持GPT3.5(16K)、GPT4和GPT4-TRUBO模型', highLight: true },
      { text: 'GPT3.5(16K) 无限制使用', },
      { text: 'GPT4和GPT4-TRUBO提问次数不限，限制总字数14万字', highLight: true },
      { text: '30次普通AI绘画', highLight: true },
      { text: '30次MidJourney绘画', highLight: true },
    ],
  }
]
</script>
<template>
<div>api</div>
</template>
<style scoped lang='scss'>

</style>