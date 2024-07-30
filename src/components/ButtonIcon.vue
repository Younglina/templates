<script setup></script>
<template>
  <button class="button-icon"><slot></slot></button>
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
</style>
