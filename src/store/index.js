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
  },
})
