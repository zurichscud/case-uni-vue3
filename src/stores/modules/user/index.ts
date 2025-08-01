import { defineStore } from 'pinia'
import * as UserAPI from '@/apis/user'
import type { UserState } from './types'
import { getRemarkText } from '@/enums/remark'
import appConfig from '@/config/app'
import type { LoginParams } from '@/apis/user'

// 使用命名导出取代默认导出
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    token: undefined,
    nickName: undefined,
    mobile: undefined,
    photo: undefined,
    remark: undefined,
    pid: undefined,
  }),

  getters: {
    userInfo(state: UserState) {
      return { ...state }
    },
    isLogin(): boolean {
      return !!this.token
    },
    remarkText(): string {
      return getRemarkText(this.remark!)
    },
  },

  actions: {
    // 设置用户信息
    setUser(info: any) {
      this.$patch(info)
    },
    // 重置用户信息
    resetInfo() {
      this.$reset()
    },
    // 获取用户信息
    async getUserInfo() {
      const { data } = await UserAPI.getUserInfo()
      this.setUser({
        id: data.id,
        nickName: data.nickName,
        mobile: data.mobile,
        photo: data.photo,
        remark: data.remark,
      })
    },
    // 登录
    async login(loginForm: LoginParams, redirect: string) {
      const { data } = await UserAPI.login(loginForm)
      this.setUser({
        id: data.id,
        nickName: data.nickName,
        mobile: data.mobile,
        photo: data.photo || appConfig.defaultAvatar,
        remark: data.remark,
        token: data.token,
      })
      uni.showToast({
        title: '登录成功',
        icon: 'success',
      })
      setTimeout(() => {
        uni.reLaunch({
          url: redirect,
        })
      }, 1000)
    },
    // 退出
    logout() {
      this.resetInfo()
      uni.reLaunch({
        url: '/pages/index/user',
      })
    },
  },
})

export default useUserStore
