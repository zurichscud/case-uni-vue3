import { defineStore } from 'pinia'
import * as UserAPI from '@/apis/user'
import type { UserState } from './types'
import { getRemarkText } from '@/enums/remark'
import defaultAvatar from '@/static/user.png'

// 使用命名导出取代默认导出
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    token: undefined,
    nickName: undefined,
    mobile: undefined,
    photo: defaultAvatar,
    remark: undefined,
  }),

  getters: {
    userInfo(state: UserState) {
      return { ...state }
    },
    isLogin() {
      return !!this.token
    },
    remarkText(){
      return getRemarkText(this.remark)
    }
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
      const {data}=await UserAPI.getUserInfo({id:this.id})
      this.setUser({
        id:data.id,
        nickName:data.nickName,
        mobile:data.mobile,
        photo:data.photo,
        remark:data.remark,
      })
    },
    // 登录
    async login(loginForm: { source: number; mobile: string; registerType: number }) {
      const { datas } = await UserAPI.register(loginForm)
      this.setUser({
        id:datas.id,
        nickName:datas.nickName,
        mobile:datas.mobile,
        photo:datas.photo,
        remark:datas.remark,
        token:datas.token,
      })
      if(this.remark){
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }else{
        //TODO：我也不知道有啥用
        await UserAPI.selectIdentity({
          userId:this.id,
          type:'2'
        })
      }
    },
    // 退出
    logout() {
      this.resetInfo()
      uni.reLaunch({
        url:'/pages/index/index'
      })
    },
  },
  persist: true,
})

export default useUserStore
