import { defineStore } from "pinia";

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    tt: "",
    player: {},
    baseData: {
      user: {},
      loginMode: "",
    },
  }),
  actions: {
    test(tt) {
      this.tt = tt;
    },
  },
});
