import { defineStore } from "pinia";
import { playlistCategories } from "@/constants";
export const useMainStore = defineStore("mainStore", {
  state: () => ({
    tt: "",
    player: {
      currentTrack: {},
    },
    baseData: {
      user: {},
      loginMode: "",
    },
    liked: {
      songs: [],
      songsWithDetails: [], // 只有前12首
      playlists: [],
      albums: [],
      artists: [],
      mvs: [],
      cloudDisk: [],
      playHistory: {
        weekData: [],
        allData: [],
      },
    },
    settings: {
      enabledPlaylistCategories: playlistCategories
        .filter((item) => item.enable)
        .map((item) => item.name),
    },
    user: {},
  }),
  actions: {
    test(tt) {
      this.tt = tt;
    },
    togglePlaylistCategory(name) {
      const cats = this.settings.enabledPlaylistCategories;
      const index = cats.findIndex((c) => c === name);
      console.log(index, this.settings.enabledPlaylistCategories);
      if (index !== -1) {
        this.settings.enabledPlaylistCategories = cats.filter(
          (c) => c !== name
        );
      } else {
        this.settings.enabledPlaylistCategories.push(name);
      }
    },
  },
  getters: {},
  persist: true,
});
