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
