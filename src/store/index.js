/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
 */
import { defineStore } from 'pinia'

export default defineStore('mainStore', {
  state: () => ({
    data: {},
    userInfo: null,
    isCollapse: false,
    currentEditArea: null,
    loginMode: '', // 登录模式
    dailyTracks: [], // 日推歌单
    player: {
      replacePlaylist: (
        trackIDs,
        playlistSourceID,
        playlistSourceType,
        autoPlayTrackID = 'first'
      ) => {
        console.log(
          trackIDs,
          playlistSourceID,
          playlistSourceType,
          autoPlayTrackID = 'first'
        )
      }
    }
  }),
  getters: {
    getUserInfo(state) {
      return state.userInfo
    },
  },
  actions: {
    toggleAsideBar() {
      this.isCollapse = !this.isCollapse
    },
    updateDailyTracks(data) {
      this.dailyTracks = data
    }
  },
})
