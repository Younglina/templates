import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/home.vue";

const routes = [
  { path: "/", component: Home, name: "home" },
  {
    path: "/login",
    component: () => import("../pages/loginAccount.vue"),
    name: "login",
  },
  {
    path: "/test",
    component: () => import("../pages/lyric.vue"),
    name: "test",
  },
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
    path: "/daily/songs",
    component: () => import("../pages/dailySongs.vue"),
    name: "dailySongs",
  },
  {
    path: "/album/:id?",
    component: () => import("../pages/album.vue"),
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
  {
    path: "/search/:keywords?",
    component: () => import("../pages/search.vue"),
    name: "search",
  },
  {
    path: "/search/:keywords/:type",
    component: () => import("../pages/searchType.vue"),
    name: "searchType",
  },
];

const router = createRouter({
  history: createWebHistory("/music/"),
  routes,
});

export default router;
