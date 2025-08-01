import { useUserStore } from '@/stores'
import { shareOptions } from '@/config/wechat'

interface ShareOptions {
  title?: string
  path?: string
  imageUrl?: string
}
  const shareConfig = shareOptions
/**
 * 分享hooks - 封装小程序分享逻辑
 * @param options 分享配置选项
 * @returns 分享相关方法和配置
 */
export function useShare(options: ShareOptions = {}) {
  const userStore = useUserStore()

  // 默认分享配置

  const defaultOptions = {
    ...shareConfig,
    path: `${shareConfig.path}?pid=${userStore.id}`,
  }

  // 合并默认配置和用户配置
  const shareOptions = { ...defaultOptions, ...options }

  return {
    shareOptions,
  }
}
