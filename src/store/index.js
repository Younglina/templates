import { defineStore } from "pinia"

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    breadcrumbs: [{ path: "/", label: "首页" }],
    bcMaxNum: 8,
    bcLRU: new Map([["/", "/"]])
  }),
  actions: {
    setBreadcrumbs(bc) {
      let bcLRU = this.bcLRU
      console.log(bcLRU, this.breadcrumbs)
      if (bcLRU.has(bc.path)) bcLRU.delete(bc.path)
      else this.breadcrumbs.push(bc)
      bcLRU.set(bc.path, bc.path)
      if (bcLRU.size > this.bcMaxNum) {
        let key = bcLRU.keys().next().value
        let idx = this.breadcrumbs.findIndex((i) => i.path === key)
        this.breadcrumbs.splice(idx, 1)
        bcLRU.delete(key)
      }
    },
    delBreadcrumbs(bc) {
      let idx = this.breadcrumbs.findIndex((i) => i.path === bc.path)
      this.breadcrumbs.splice(idx, 1)
      if (this.bcLRU.has(bc.path)) this.bcLRU.delete(bc.path)
    }
  }
})
