import { defineStore } from "pinia";
import { playlistCategories } from "@/constants";
import { isAccountLoggedIn } from "@/utils/auth";
import { userPlaylist, userAccount } from "@/api/user";
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
    updateData(k, v) {
      this.baseData[k] = v;
    },
    togglePlaylistCategory(name) {
      const cats = this.settings.enabledPlaylistCategories;
      const index = cats.findIndex((c) => c === name);
      if (index !== -1) {
        this.settings.enabledPlaylistCategories = cats.filter(
          (c) => c !== name
        );
      } else {
        this.settings.enabledPlaylistCategories.push(name);
      }
    },
    fetchLikedPlaylist() {
      if (!isAccountLoggedIn()) return;
      if (isAccountLoggedIn()) {
        return userPlaylist({
          uid: this.baseData.user?.id,
          limit: 2000,
          timestamp: new Date().getTime(),
        }).then((result) => {
          if (result.playlist) {
            this.liked.playlists = result.playlist;
            // 更新用户”喜欢的歌曲“歌单ID
            this.liked.likedSongPlaylistID = result.playlist[0].id;
          }
        });
      } else {
        // TODO:搜索ID登录的用户
      }
    },
    fetchUserProfile() {
      if (!isAccountLoggedIn()) return;
      return userAccount().then((result) => {
        if (result.code === 200) {
          this.updateData("user", result.profile);
        }
      });
    },
  },
  getters: {},
  persist: true,
});
