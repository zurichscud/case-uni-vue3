import { isString, isEmpty, startsWith, isObject, isNil } from 'lodash-es'
import throttle from '@/utils/throttle'
import { useUserStore } from '@/stores'

interface RouteParams {
  [key: string]: string | number | boolean
}

interface RouteOptions {
  redirect: boolean
}

interface RouteObject {
  url: string
  params?: RouteParams
}

type RoutePathParam = string | RouteObject

interface PageInstance {
  $page?: {
    route?: string
    options?: Record<string, any>
    [key: string]: any
  }
  route?: string
  options?: Record<string, any>
}

const userStore = useUserStore()

const _go = (
  path: RoutePathParam,
  params: RouteParams = {},
  options: RouteOptions = {
    redirect: false,
  },
): void => {
  let page = '' // 跳转页面
  let query = '' // 页面参数
  let url = '' // 跳转页面完整路径

  if (isString(path)) {
    // 判断跳转类型是 path ｜ 还是http
    if (startsWith(path, 'http')) {
      // #ifdef H5
      window.location.href = path
      return
      // #endif
      // #ifndef H5
      page = `/pages/public/webview`
      query = `url=${encodeURIComponent(path as string)}`
      // #endif
    } else if (startsWith(path, 'action:')) {
      handleAction(path)
      return
    } else {
      const pathParts = path.split('?')
      page = pathParts[0]
      query = pathParts[1] || ''
    }
    if (!isEmpty(params)) {
      const query2 = paramsToQuery(params)
      if (isEmpty(query)) {
        query = query2
      } else {
        query += '&' + query2
      }
    }
  }

  if (isObject(path) && !isString(path)) {
    const routeObj = path as RouteObject
    page = routeObj.url
    if (!isNil(routeObj.params)) {
      query = paramsToQuery(routeObj.params)
    }
  }

  const nextRoute = ROUTES_MAP[page]

  // 未找到指定跳转页面
  if (!nextRoute) {
    console.log(`%c未找到指定路径<${page || 'EMPTY'}>`, 'color:red;background:yellow')
    return
  }

  if (nextRoute.dev) {
    uni.showToast({
      title: '敬请期待',
      icon: 'error',
    })
    return
  }

  // 页面登录拦截
  if (nextRoute.auth && !userStore.isLogin) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
    return
  }

  url = page
  if (!isEmpty(query)) {
    url += `?${query}`
  }

  // 跳转底部导航
  if (TABBAR.includes(page)) {
    console.log('[ TABBAR.includes ]-113', TABBAR.includes)
    uni.switchTab({
      url,
    })
    return
  }

  // 使用redirect跳转
  if (options.redirect) {
    uni.redirectTo({
      url,
    })
    return
  }

  uni.navigateTo({
    url,
  })
}

// 限流 防止重复点击跳转
function push(path: RoutePathParam, params: RouteParams = {}, options?: RouteOptions): void {
  throttle(() => {
    _go(path, params, options)
  })
}

function paramsToQuery(params: Record<string, string | number | boolean>): string {
  if (isEmpty(params)) {
    return ''
  }
  // return new URLSearchParams(Object.entries(params)).toString();
  const query: string[] = []
  for (const key in params) {
    query.push(key + '=' + params[key])
  }

  return query.join('&')
}

function back(): void {
  // #ifdef H5
  history.back()
  // #endif

  // #ifndef H5
  uni.navigateBack()
  // #endif
}

function redirect(path: RoutePathParam, params: RouteParams = {}): void {
  push(path, params, {
    redirect: true,
  })
}

// 检测是否有浏览器历史
function hasHistory(): boolean {
  // #ifndef H5
  const pages = getCurrentPages()
  if (pages.length > 1) {
    return true
  }
  return false
  // #endif

  // #ifdef H5
  return !!history.state.back
  // #endif
}

function getCurrentRoute(field: string = ''): any {
  const currentPage = getCurrentPage() as PageInstance
  // #ifdef MP
  if (currentPage.route && !currentPage.$page) {
    currentPage.$page = {
      route: currentPage.route,
      options: currentPage.options || {},
    }
  }
  // #endif
  if (field !== '' && currentPage.$page) {
    return currentPage.$page[field]
  } else {
    return currentPage.$page
  }
}

function getCurrentPage(): PageInstance {
  const pages = getCurrentPages()
  return pages[pages.length - 1] as PageInstance
}

//TODO
function handleAction(path: string): void {
  const action = path.split(':')
  switch (action[1]) {
    case 'showShareModal':
      break
  }
}

//TODO
function error(errCode: string | number, errMsg: string = ''): void {
  redirect('/pages/error/network', {
    errCode: String(errCode),
    errMsg,
  })
}

export default {
  push,
  back,
  hasHistory,
  redirect,
  getCurrentPage,
  getCurrentRoute,
  error,
}
