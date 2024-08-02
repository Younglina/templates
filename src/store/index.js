import { defineStore } from "pinia";
import { playlistCategories } from "@/constants";
export const useMainStore = defineStore("mainStore", {
  state: () => ({
    tt: "",
    player: {},
    baseData: {
      user: {},
      loginMode: "",
    },
    settings: {
      enabledPlaylistCategories: playlistCategories
        .filter((item) => item.enable)
        .map((item) => item.name),
    },
  }),
  actions: {
    test(tt) {
      this.tt = tt;
    },
    togglePlaylistCategory(name) {
      const enabledPlaylistCategories = this.settings.enabledPlaylistCategories;
      const index = enabledPlaylistCategories.findIndex((c) => c === name);
      if (index !== -1) {
        enabledPlaylistCategories = enabledPlaylistCategories.filter(
          (c) => c !== name
        );
      } else {
        enabledPlaylistCategories.push(name);
      }
    },
  },
  getters: {},
  persist: true,
});
