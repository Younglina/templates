import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    tt: '',
  }),
  actions: {
    test(tt) {
      this.tt = tt
    },
  },
})
