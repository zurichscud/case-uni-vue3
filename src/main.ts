import { createSSRApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import './api'
import router from './router'
import { persistPlugin } from './stores/persist'


import './style/iconfont.css'
import './style/font.scss'
import './style/index.scss'

const pinia = createPinia()
pinia.use(persistPlugin)
export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
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
