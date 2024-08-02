import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/home.vue";

const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/library", component: Home, name: "library" },
  {
    path: "/explore/:category?",
    component: () => import("../pages/explore.vue"),
    name: "explore",
  },
  {
    path: "/playlist/:id?",
    component: () => import("../pages/explore.vue"),
    name: "playlist",
  },
  {
    path: "/album/:id?",
    component: () => import("../pages/explore.vue"),
    name: "album",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
