<!--
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-08 13:04:58
 * @Description: 静态页面 按页面传参数t区分
 * quick-start 快速上手
 * gpt-use GPT使用指南
-->
<script setup>
defineProps(['query'])
const columns = [
  { prop: 'Model', label: 'Model' },
  { prop: 'InputUs', label: 'Input(我们)' },
  { prop: 'InputOf', label: 'Input(官方)' },
  { prop: 'OutputUs', label: 'Output(我们)' },
  { prop: 'OutputOf', label: 'Output(官方)' },
]
const gpt35Table = {
  columns: columns,
  data: [
    { Model: '4k content', InputUs: '$0.0006/1k tokens', InputOf: '	$0.0015/1k tokens', OutputUs: '$0.0008/1k tokens', OutputOf: '$0.002/1k tokens' },
    { Model: '16k content', InputUs: '$0.0012/1k tokens', InputOf: '	$0.003/1k tokens', OutputUs: '$0.0016/1k tokens', OutputOf: '$0.004/1k tokens' },
    { Model: '16k content（1106）', InputUs: '$0.0004/1k tokens', InputOf: '	$0.001/1k tokens', OutputUs: '$0.0008/1k tokens', OutputOf: '$0.002/1k tokens' }
  ],
}
const gpt40Table = {
  columns: columns,
  data: [
    { Model: '8k content', InputUs: '$0.012/1k tokens', InputOf: '	$0.03/1k tokens', OutputUs: '$0.024/1k tokens', OutputOf: '$0.06/1k tokens' },
    { Model: '32k content', InputUs: '$0.024/1k tokens', InputOf: '	$0.06/1k tokens', OutputUs: '$0.048/1k tokens', OutputOf: '$0.12/1k tokens' }
  ],
}
const gpt4TTable = {
  columns: columns,
  data: [
    { Model: '1106-preview', InputUs: '$0.004/1k tokens', InputOf: '	$0.01/1k tokens', OutputUs: '$0.012/1k tokens', OutputOf: '$0.03/1k tokens' },
    { Model: '1106-vision-preview', InputUs: '$0.004/1k tokens', InputOf: '	$0.01/1k tokens', OutputUs: '$0.012/1k tokens', OutputOf: '$0.03/1k tokens' }
  ],
}
</script>
<template>
  <div v-if="query === 'quick-start'">
    <p>如果您还没有对接过官方的API，请您参照此文档接入：<a href="https://www.showdoc.com.cn/hellogptworld" target="_blank">接入文档</a>， 实际和<a
        href="https://platform.openai.com/docs/api-reference" target="_blank">官方接口</a>无异。</p>
    <p>如果您已经对接过官方API，请您按照以下步骤进行无缝切换。</p>
    <h2>只需两步，无缝切换。</h2>
    <h3>API_KEY</h3>
    <ul>
      <li>1. 注册并登录vip.gptchatclub.com网站，在侧边栏找到“API对接”的“API keys”页面获取<el-tag type="info">api_key</el-tag></li>
      <li>2.
        复制<el-tag type="info">tb-</el-tag>开头的<el-tag type="info">api_key</el-tag>，将原请求头中的<el-tag
          type="info">api_key</el-tag>替换成我们专属的<el-tag type="info">api_key</el-tag>
      </li>
    </ul>
    <p>例如：</p>
    <ul>
      <li>原来: <el-tag type="info">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</el-tag></li>
      <li>现在: <el-tag type="info">tb-Fdwqeqrrq1Zp37rfqW1Gesdewsgsd4ox85zsdasfVox8bpyp</el-tag></li>
    </ul>
    <h3>URL</h3>
    <p>原请求地址 <el-tag type="info">api.openai.com</el-tag>更换为 <el-tag type="info">api.hellogptworld.com</el-tag></p>
    <p>例如：</p>
    <ul>
      <li>原来: <el-tag type="info">https://api.openai.com/v1/chat/completions</el-tag></li>
      <li>现在: <el-tag type="info">https://api.hellogptworld.com/v1/chat/completions</el-tag></li>
    </ul>
  </div>
  <div v-if="query === 'price'">
    <h3>GPT-3.5</h3>
    <p>单位:美元</p>
    <p>模型列表:gpt-3.5-turbo、gpt-3.5-turbo-0301、gpt-3.5-turbo-0613、<el-tag
        type="info">gpt-3.5-turbo-1106(推荐)</el-tag>、gpt-3.5-turbo-16k</p>
    <the-table :tableInfo="gpt35Table"></the-table>
    <p></p>
    <h3>GPT-4</h3>
    <p>单位:美元</p>
    <p>模型列表:gpt-4、gpt-4-0314、<el-tag type="info">gpt-4-0613(推荐)</el-tag></p>
    <p>TIP</p>
    <p><span class="ant-tag css-1adbn6x">gpt-4</span> 目前只支持 8K context 版本，传入<span
        class="ant-tag css-1adbn6x">gpt-4</span>默认就是 8K ,暂时不支持 <span class="ant-tag css-1adbn6x">gpt-4-32k</span></p>
    <the-table :tableInfo="gpt40Table"></the-table>
    <p></p>
    <h3>GPT-4-TURBO</h3>
    <p>单位:美元</p>
    <p>模型列表:gpt-4-1106-preview</p>
    <the-table :tableInfo="gpt4TTable"></the-table>
    <p></p>
    <p>折扣在购买卡密的时候体现（目前是4折）计费时我们会跟官方计费方式保持一致，汇率根据实时汇率进行调整。不同时期购买的卡密价格会有差异，价格越高的卡密折扣越大，请以购买时的卡密折扣价格为准。</p>
    <p>汇率：1美元=7.3人民币(会随时调整)</p>
  </div>
  <div v-if="query === 'service'">
    可联系我们的技术支持QQ： <el-tag type="info">12312312312</el-tag>竭诚为您服务。
  </div>
  <div v-if="query === 'gpt-use'">
    <h2>为什么推荐 GPT-3.5-turbo</h2>
    <p>根据我们的用户在处理数十亿 tokens 过程中的经验教训，我们得出了以下关于 GPT-4 和 GPT-3.5 的使用建议：</p>
    <ul>
      <li>我们不推荐普通用户使用 GPT-4，因为 GPT-3.5 的响应速度比 GPT-4 快四倍，而且 GPT-4 的价格比 GPT-3.5 高出157.5 倍-315 倍。</li>
      <li>如果您还是想尝试 GPT-4，请务必注意：在对话过程中避免添加过量无关上下文。这样做不会提高语境理解，反而会消耗更多 tokens。</li>
    </ul>
    <p></p>
    <h2>为什么 GPT-4 或 GPT-3.5 无法辨认自身的版本？</h2>
    <p>首先，如果你询问 GPT-4：你是 GPT-4 吗？它很有可能会回答：我是 OpenAI 的 GPT-3 模型，目前尚未推出 GPT-4。</p>
    <p>这种现象背后的原因是，OpenAI 提供的 GPT-4 API 使用的训练数据截止到 2021 年 9 月。当模型训练完成后，若不再次进行训练，它所包含的知识并不会自动更新。就像你在 2021 年无法回答 2023
      年你享用的第一顿饭是什么一样，你给出的答案必然是错误的。</p>
    <p></p>
    <p></p>
    <h2>如何区分 GPT-3.5 和 GPT-4？</h2>
    <p>你可以尝试提问：“树上有 9 只鸟，猎人开枪打死一只，树上还剩下多少只鸟？”</p>
    <ul>
      <li>在 90%的情况下，GPT-3.5 都会回答剩下 8 只鸟；</li>
      <li>而 GPT-4 则大概率会回答剩下 0 只鸟，因为其他的都被吓跑了。</li>
    </ul>
    <p>如果这个问题测试不出来，你可以新建上下文或者多试几次，请不要在一个上下文内连续询问。</p>
    <p></p>
    <h2>Tokens 是什么？</h2>
    <p>Token 是 GPT 处理文本的基本单位。简而言之，Token 可以是一个字、一个词或特定语言中的一个字符。它们负责将输入的文本数据转换为 GPT 可以处理的数据格式。</p>
    <ul>
      <li>作用：Tokens 的数量影响模型的能力，例如理解复杂语义、表达丰富内容以及高效处理长篇文本等。</li>
      <li>限制：然而，较多的 Tokens 数量意味着更大的计算资源需求，可能导致处理速度减慢和内存需求增加。</li>
    </ul>
    <p>每个 GPT 模型都有一个预设的最大 Tokens 数量。例如，GPT-3 允许处理的最大 Tokens 数量约为 4096。需要注意的是，这个数量包括输入和输出的所有 Tokens。</p>
    <p></p>
    <p></p>
    <h2>什么是上下文？</h2>
    <p>在 GPT 用于文本生成时，它需要考虑之前输入的所有文本上下文，以生成连贯、有意义的句子。随着输入上下文的增加，GPT 生成的文本变得越来越连贯和精准。例如，如果将一篇完整的文章或段落作为输入，GPT
      将能生成符合上下文连贯性的自然语言文本。因此，GPT 上下文累积得越多，生成文本的准确度和连贯性呈逐步提升趋势。</p>
  </div>
</template>
<style scoped lang='scss'></style>    