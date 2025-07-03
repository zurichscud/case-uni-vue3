import { defineStore } from 'pinia'
import type { MessageState } from './types'
import * as MessageAPI from '@/apis/message'
import { useUserStore } from '@/stores'
export const useMessageStore = defineStore('message', {
  state: (): MessageState => ({
    unreadNum: 0,
  }),
  getters: {},
  actions: {
    setMessage(info: any) {
      this.$patch(info)
    },
    setRedDot() {
      uni.setTabBarBadge({
        index: 2,
        text: String(this.unreadNum),
      })
    },
    removeRedDot() {
      uni.removeTabBarBadge({
        index: 2,
      })
    },
    // 重置用户信息
    resetMessage() {
      this.$reset()
    },
    async getUnReadNumData() {
      const userStore = useUserStore()
      const { datas } = await MessageAPI.getUnReadMessage({
        userId: userStore.id,
      })
      this.unreadNum = datas.count.caseStatusCount + datas.count.interactCount + datas.count.sysCount
      if (this.unreadNum > 0) {
        this.setRedDot()
      } else {
        this.removeRedDot()
      }
    },
  },
  persist: true,
})

export default useMessageStore
