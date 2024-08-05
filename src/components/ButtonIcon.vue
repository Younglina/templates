<script setup>
defineProps({
  grey: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <button class="button-icon" :class="[grey ? 'grey' : '']">
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  padding: 8px;
  margin-left: 8px;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  border: none;
  transition: 0.1s;
  background-color: transparent;
  border-radius: 25%;
  &:first-child {
    margin-left: 0;
  }
  &:hover {
    background: var(--color-secondary-bg-for-transparent);
  }
  &:active {
    transform: scale(0.95);
  }
}
.grey {
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 18px;
  font-weight: 600;
  background-color: var(--color-secondary-bg);
  color: var(--color-text);
  opacity: 0.78;
  border-radius: 8px;
}
</style>
