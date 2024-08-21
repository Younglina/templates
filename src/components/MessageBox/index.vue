<script>
export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["vanish", "action"],
  setup(props, { emit }) {
    const visible = ref(false);
    function doClose() {
      if (!visible.value) return;
      visible.value = false;
      emit("action", "close");
    }
    return {
      doClose,
      visible,
    };
  },
});
</script>

<template>
  <transition name="fade" @after-leave="$emit('vanish')">
    <div v-show="visible" class="modal-overlay">
      <div class="modal-content">
        <header class="modal-header">
          <h3 v-if="title">
            {{ title }}
          </h3>
          <ButtonIcon @click="doClose">
            <div class="i-material-symbols-close-rounded font-size-20px" />
          </ButtonIcon>
        </header>
        <main class="modal-body">
          <p>{{ message }}</p>
        </main>
        <footer v-if="showFooter" class="modal-footer">
          <button @click="doClose">确定</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
    border: unset;
    width: 0;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-secondary-bg-for-transparent);
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px) opacity(1);
  border-radius: 12px;
  width: 50vw;
  max-height: calc(100vh - 128px - 64px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 12px;
  h3 {
    font-size: 20px;
    font-weight: 600;
  }
}

.modal-body {
  font-size: 16px;
  overflow-y: auto;
  padding: 0 20px 20px;
  p {
    overflow: hidden;
    white-space: pre-line;
    user-select: none;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  button {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
    border-radius: 8px;
    margin-top: 24px;
    transition: 0.2s;
    padding: 8px;
    min-width: 60px;
  }
}
</style>
