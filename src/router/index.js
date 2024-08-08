import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/home.vue";

const routes = [
  { path: "/", component: Home, name: "home" },
  {
    path: "/login",
    component: () => import("../pages/loginAccount.vue"),
    name: "login",
  },
  { path: "/test", component: () => import("../pages/test.vue"), name: "test" },
  {
    path: "/library",
    component: () => import("../pages/library.vue"),
    name: "library",
  },
  {
    path: "/explore/:category?",
    component: () => import("../pages/explore.vue"),
    name: "explore",
  },
  {
    path: "/playlist/:id?",
    component: () => import("../pages/playlist.vue"),
    name: "playlist",
  },
  {
    path: "/album/:id?",
    component: () => import("../pages/explore.vue"),
    name: "album",
  },
  {
    path: "/artist/:id?",
    component: () => import("../pages/artist.vue"),
    name: "artist",
  },
  {
    path: "/mv/:id?",
    component: () => import("../pages/mv.vue"),
    name: "mv",
  },
];

const router = createRouter({
  history: createWebHistory("/music/"),
  routes,
});

export default router;
