## 配置Uno css
"unocss.root": "/Users/younglina/Documents/gpt-project",

## 双向修改
useVmodel
```
// child
const props = defineProps(['isShow'])
const isShow = useVModel(props, 'isShow')

<div @click="isShow = true"></div>

// father
<TheAside v-model:isShow="isShow" />
```