import "virtual:uno.css";
import { createApp } from "vue";
import { createPinia } from "pinia";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { vLoading } from "./directives/loading.js";

import router from "./router";
import App from "./App.vue";

import "./styles/index.scss";
import "./styles/plyr.scss";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.directive("loading", vLoading);
app.use(pinia).use(router).mount("#app");
