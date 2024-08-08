<script setup>
import { useVModel } from "@vueuse/core";
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  modelValue:{
    required: true
  }
});
const emit = defineEmits(["update:modelValue"]);

const data = useVModel(props, "modelValue", emit);
</script>
<template>
  <div class="input-box">
    <slot></slot>
    <input class="input" v-model="data" :type="type" :placeholder="placeholder"></input>
  </div>
</template>
<style scoped lang="scss">
.input-box {
  display: flex;
  align-items: center;
  height: 46px;
  background: var(--color-secondary-bg);
  border-radius: 8px;
  width: 300px;
  margin-bottom: 16px;
  color: var(--color-text);
  &:has(input:focus) {
    background: var(--color-primary-bg);
    :deep(>div){
      color: var(--color-primary);
    }
    .input{
      color: var(--color-primary);
      background: var(--color-primary-bg);
    }
  }
  :deep(>div){
    font-size: 26px;
    color: #aaaaaa;
    margin-left: 12px;
    margin-right: 6px;
  }
  .input {
    font-size: 20px;
    border: none;
    background: transparent;
    width: 100%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
    outline: none;
  }
  input::placeholder {
    color: var(--color-text);
    opacity: 0.38;
  }
}
</style>
