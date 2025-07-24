/// <reference types="@uni-helper/vite-plugin-uni-pages/client" />
import { pages, subPackages } from 'virtual:uni-pages'
import { useUserStore } from '@/stores'
import { isProd } from '@/utils/env'
// 扩展路由类型
declare module '@vue/router' {
  interface RouteMeta {
    auth?: boolean
    dev?: boolean
  }
}

function generateRoutes() {
  const routes = pages.map((page) => {
    const newPath = `/${page.path}`
    return { ...page, path: newPath }
  })
  if (subPackages && subPackages.length > 0) {
    subPackages.forEach((subPackage) => {
      const subRoutes = subPackage.pages.map((page: any) => {
        const newPath = `/${subPackage.root}/${page.path}`
        return { ...page, path: newPath }
      })
      routes.push(...subRoutes)
    })
  }
  return routes
}

const router = createRouter({
  routes: generateRoutes(),
})

// 防抖标志
let isNavigating = false

router.beforeEach((to, from, next) => {
  // 防抖机制：如果正在导航中，则阻止新的导航
  if (isNavigating) {
    return
  }

  isNavigating = true
  if ((to as any).dev) {
    uni.showToast({
      title: '敬请期待',
      icon: 'error',
    })
    isNavigating = false
    next(false)
    return
  }

  if ((to as any).auth) {
    const userStore = useUserStore()
    if (!userStore.isLogin) {
      next('/pages/login/login')
      return
    }
  }
  // 继续导航
  next()
})

// eslint-disable-next-line unused-imports/no-unused-vars
router.afterEach((to, from) => {
  // 导航完成，重置防抖标志
  isNavigating = false
})

export default router
