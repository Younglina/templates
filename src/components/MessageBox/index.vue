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
          <h3>{{ title }}</h3>
          <ButtonIcon @click="doClose">
            <div class="i-material-symbols-close-rounded font-size-20px"></div>
          </ButtonIcon>
        </header>
        <main class="modal-body">
          {{ message }}
        </main>
        <footer class="modal-footer" v-if="showFooter">
          <button @click="doClose">确定</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style scoped>
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
}

.modal-content {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 20px;
  max-width: 490px;
  width: 90%;
  max-height: calc(100vh - 128px - 64px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 32px;
}

.modal-body {
  font-size: 16px;
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
