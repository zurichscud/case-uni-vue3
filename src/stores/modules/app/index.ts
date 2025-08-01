import { defineStore } from 'pinia'
import type { AppStore, EnvVersion } from './types'

const ENV: Record<EnvVersion, string> = {
  develop: '开发版',
  trial: '体验版',
  release: '正式版',
}

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    version: '4.1.3',
    wxVersion: '',
    envVersion: '',
  }),
  getters: {
    env(): string {
      return ENV[this.envVersion as EnvVersion] || ''
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
