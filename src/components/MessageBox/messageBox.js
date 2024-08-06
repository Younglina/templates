import { createVNode, render } from "vue";
import MessageBoxConstructor from "./index.vue";

const messageInstance = new Map();
const initInstance = (props, container, appContext) => {
  const vnode = createVNode(MessageBoxConstructor, props, null);
  vnode.appContext = appContext;
  render(vnode, container);
  document.body.appendChild(
    container.firstElementChild || container.firstChild
  );
  return vnode.component;
};

const showMessage = (options, appContext) => {
  const container = document.createElement("div");
  options.onVanish = () => {
    render(null, container);
    messageInstance.delete(vm);
  };
  options.onAction = (action) => {
    const currentMsg = messageInstance.get(vm);
    // if (action === "close") {
    //   currentMsg.reject("close");
    // } else {
    currentMsg.resolve(action);
    // }
  };

  const instance = initInstance(options, container, appContext);
  const vm = instance.proxy;
  for (const prop in options) {
    if (options.hasOwnProperty(prop) && !vm.$props.hasOwnProperty(prop)) {
      vm[prop] = options[prop];
    }
  }
  vm.visible = true;
  return vm;
};

function MessageBox(options, appContext) {
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }

  return new Promise((resolve, reject) => {
    const vm = showMessage(options, appContext);
    messageInstance.set(vm, { options, resolve, reject });
  });
}

MessageBox.close = () => {
  messageInstance.forEach(({ _, vm }) => {
    vm.doClose();
  });
  messageInstance.clear();
};

export default MessageBox;
