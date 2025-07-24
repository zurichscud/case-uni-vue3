import { defineStore } from 'pinia'
import type { MessageState } from './types'
import * as MessageAPI from '@/apis/message'
import { useUserStore } from '@/stores'
import { useTabbar } from '@/composables/useTabbar'

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
      const { setTabbarItem } = useTabbar()
      setTabbarItem('message', this.unreadNum)
    },
    removeRedDot() {
      const { setTabbarItem } = useTabbar()
      setTabbarItem('message', 0)
    },
    // 重置用户信息
    resetMessage() {
      this.$reset()
    },
    async getUnReadNumData() {
      const userStore = useUserStore()
      const { data } = await MessageAPI.getUnReadMessage({
        userId: userStore.id,
      })
      this.unreadNum = data.count.caseStatusCount + data.count.interactCount + data.count.sysCount
      if (this.unreadNum > 0) {
        this.setRedDot()
      }
      else {
        this.removeRedDot()
      }
    },
  },
})

export default useMessageStore
