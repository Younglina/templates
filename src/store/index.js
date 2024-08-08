import { defineStore } from "pinia";
import { playlistCategories } from "@/constants";
import { isAccountLoggedIn, isLooseLoggedIn } from "@/utils/auth";
import { getPlaylistDetail } from "@/api/playlist";
import { getTrackDetail } from "@/api/track";
import {
  userPlaylist,
  userPlayHistory,
  userLikedSongsIDs,
  likedAlbums,
  likedArtists,
  likedMVs,
  cloudDisk,
  userAccount,
} from "@/api/user";
export const useMainStore = defineStore("mainStore", {
  state: () => {
    return {
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
      likedSongPlaylistID: "",
    };
  },
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
      if (!isLooseLoggedIn()) return;
      if (isAccountLoggedIn()) {
        return userPlaylist({
          uid: this.baseData.user?.userId,
          limit: 2000,
          timestamp: new Date().getTime(),
        }).then((result) => {
          if (result.playlist) {
            this.liked.playlists = result.playlist;
            // 更新用户”喜欢的歌曲“歌单ID
            this.likedSongPlaylistID = result.playlist[0].id;
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
    fetchLikedSongs() {
      if (!isLooseLoggedIn()) return;
      if (isAccountLoggedIn()) {
        return userLikedSongsIDs({ uid: this.baseData.user.userId }).then(
          (result) => {
            if (result.ids) {
              this.liked.songs = result.ids;
            }
          }
        );
      } else {
        // TODO:搜索ID登录的用户
      }
    },
    fetchLikedSongsWithDetails() {
      return getPlaylistDetail(this.likedSongPlaylistID, true).then(
        (result) => {
          if (result.playlist?.trackIds?.length === 0) {
            return new Promise((resolve) => {
              resolve();
            });
          }
          return getTrackDetail(
            result.playlist.trackIds
              .slice(0, 12)
              .map((t) => t.id)
              .join(",")
          ).then((result) => {
            this.liked.songsWithDetails = result.songs;
          });
        }
      );
    },
    fetchLikedAlbums() {
      if (!isAccountLoggedIn()) return;
      return likedAlbums({ limit: 2000 }).then((result) => {
        if (result.data) {
          this.liked.albums = result.data;
        }
      });
    },
    fetchLikedArtists() {
      if (!isAccountLoggedIn()) return;
      return likedArtists({ limit: 2000 }).then((result) => {
        if (result.data) {
          this.liked.artists = result.data;
        }
      });
    },
    fetchLikedMVs() {
      if (!isAccountLoggedIn()) return;
      return likedMVs({ limit: 1000 }).then((result) => {
        if (result.data) {
          this.liked.mvs = result.data;
        }
      });
    },
    fetchCloudDisk() {
      if (!isAccountLoggedIn()) return;
      // FIXME: #1242
      return cloudDisk({ limit: 1000 }).then((result) => {
        if (result.data) {
          this.liked.cloudDisk = result.data;
        }
      });
    },
    fetchPlayHistory() {
      if (!isAccountLoggedIn()) return;
      return Promise.all([
        userPlayHistory({ uid: this.baseData.user?.userId, type: 0 }),
        userPlayHistory({ uid: this.baseData.user?.userId, type: 1 }),
      ]).then((result) => {
        const data = {};
        const dataType = { 0: "allData", 1: "weekData" };
        if (result[0] && result[1]) {
          for (let i = 0; i < result.length; i++) {
            const songData = result[i][dataType[i]].map((item) => {
              const song = item.song;
              song.playCount = item.playCount;
              return song;
            });
            data[[dataType[i]]] = songData;
          }
          this.liked.playHistory = data;
        }
      });
    },
  },
  getters: {},
  persist: true,
});
