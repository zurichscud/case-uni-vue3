import { defineStore } from 'pinia'
import type { AppStore } from './types'

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    version: '4.1.3',
    wxVersion: '',
    envVersion: '',
  }),
  getters: {
    env(): string {
      return this.envVersion
    },
  },
  actions: {
    setApp(info: any) {
      this.$patch(info)
    },
    resetApp() {
      this.$reset()
    },
    setWxVersion(version: string) {
      this.wxVersion = version
    },
  },
})

export default useAppStore
