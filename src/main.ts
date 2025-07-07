import { createSSRApp } from 'vue'
import pinia from './stores'
import { persistPlugin } from './stores/persist'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  pinia.use(persistPlugin)
  app.use(pinia)
  return {
    app,
  }
}
const updateManager = uni.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log('检查更新', res.hasUpdate)
})

updateManager.onUpdateReady(function (res) {
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

updateManager.onUpdateFailed(function (res) {
  // 新的版本下载失败
  uni.showToast({
    title: '更新失败',
    icon: 'none',
  })
})
