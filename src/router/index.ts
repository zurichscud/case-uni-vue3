/// <reference types="@uni-helper/vite-plugin-uni-pages/client" />
import { pages, subPackages } from 'virtual:uni-pages'
import { useUserStore } from '@/stores'

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
router.beforeEach((to, from, next) => {
  if (to.auth) {
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

})

export default router
