import { onShareAppMessage } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'

interface ShareOptions {
  title?: string
  path?: string
  imageUrl?: string
}

/**
 * 分享hooks - 封装小程序分享逻辑
 * @param options 分享配置选项
 * @returns 分享相关方法和配置
 */
export function useShare(options: ShareOptions = {}) {
  const userStore = useUserStore()

  // 默认分享配置
  const defaultOptions = {
    title: '快来和我一起加入理赔公社吧',
    path: `/pages/index/index?pid=${userStore.id}`,
    imageUrl: 'https://app.y9net.cn/data/01/33/wKgBNmNrSeSAbR2TAAEp5UKyBy8155.png',
  }

  // 合并默认配置和用户配置
  const shareOptions = { ...defaultOptions, ...options }

  return {
    shareOptions,
  }
}
