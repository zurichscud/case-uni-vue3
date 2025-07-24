import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'uno.css'
import './api'
import { persistPlugin } from './stores/persist'
import './style/iconfont.css'
import './style/font.scss'

// 临时清理可能损坏的存储数据
function clearCorruptedStorage() {
  try {
    const storageKeys = ['user', 'message'] // 这里列出所有可能的 store 键
    storageKeys.forEach(key => {
      const data = uni.getStorageSync(key)
      if (data && typeof data === 'string' && (data === 'undefined' || data === 'null')) {
        console.warn(`Clearing corrupted storage for key: ${key}`)
        uni.removeStorageSync(key)
      }
    })
  } catch (error) {
    console.warn('Failed to clear corrupted storage:', error)
  }
}

// 在应用启动时清理损坏的存储
clearCorruptedStorage()

const pinia = createPinia()
pinia.use(persistPlugin)
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app,
  }
}

// #ifdef MP-WEIXIN
const updateManager = uni.getUpdateManager()

updateManager.onCheckForUpdate((res) => {
  // 请求完新版本信息的回调
  console.log('检查更新', res.hasUpdate)
})

updateManager.onUpdateReady(() => {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    },
  })
})

updateManager.onUpdateFailed(() => {
  // 新的版本下载失败
  uni.showToast({
    title: '更新失败',
    icon: 'none',
  })
})
// #endif
