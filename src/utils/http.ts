import Request from 'luch-request'
import { useUserStore } from '@/stores'
import router from '@/utils/router'

// 定义图标类型
type ToastIcon = 'success' | 'loading' | 'error' | 'none' | 'fail' | 'exception'

// 定义错误码类型
type ErrorCode = 400 | 401 | 403 | 404 | 408 | 429 | 500 | 501 | 502 | 503 | 504 | 505

// 定义请求配置类型
interface RequestConfig {
  showSuccess?: boolean
  successMsg?: string
  showError?: boolean
  errorMsg?: string
  showLoading?: boolean
  loadingMsg?: string
  auth?: boolean
}

const options: RequestConfig = {
  // 显示操作成功消息 默认不显示
  showSuccess: false,
  // 成功提醒 默认使用后端返回值
  successMsg: '',
  // 显示失败消息 默认显示
  showError: true,
  // 失败提醒 默认使用后端返回信息
  errorMsg: '',
  // 显示请求时loading模态框 默认不显示
  showLoading: false,
  // loading提醒文字
  loadingMsg: '加载中',
  // 是否需要鉴权，只有登录状态才会发送请求
  auth: false,
}

// Loading全局实例
const LoadingInstance = {
  count: 0,
}

/**
 * 显示loading
 * @param {string} msg - loading提示文字
 */
function showLoading(msg: string): void {
  LoadingInstance.count++
  if (LoadingInstance.count === 1) {
    uni.showLoading({
      title: msg,
      mask: true,
      fail: () => {
        uni.hideLoading()
      },
    })
  }
}

/**
 * 关闭loading
 */
function closeLoading(): void {
  if (LoadingInstance.count > 0) {
    LoadingInstance.count--
  }
  if (LoadingInstance.count === 0) {
    uni.hideLoading()
  }
}

/**
 * 显示错误提示
 * @param {string} message - 错误信息
 * @param {ToastIcon} icon - 图标类型
 */
function showErrorToast(message: string, icon: ToastIcon = 'none'): void {
  uni.showToast({
    title: message,
    icon,
    mask: true,
  })
}

// 错误码映射表
const ERROR_CODE_MAP: Record<ErrorCode, string> = {
  400: '请求错误',
  401: '登录已过期，请重新登录',
  403: '拒绝访问',
  404: '请求出错',
  408: '请求超时',
  429: '请求频繁, 请稍后再访问',
  500: '服务器开小差啦,请稍后再试~',
  501: '服务未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'HTTP 版本不受支持',
}

const http = new Request({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  method: 'GET',
  header: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'source': 'weixin',
  },
  custom: options,
})

/**
 * @description 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (!config.header) {
      config.header = {}
    }
    if (config.custom?.showLoading) {
      showLoading(config.custom.loadingMsg || '加载中')
    }
    if (token) {
      config.header.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
/**
 * @description 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    if (response.config.custom?.showLoading) {
      closeLoading()
    }
    if (response.data.code !== 200) {
      if (response.data.code === 401) {
        handle401Error()
      }
      if (response.config.custom?.showError) {
        showErrorToast(response.data.message || '服务器开小差啦,请稍后再试~', 'none')
      }
      // 未知状态码抛出服务器异常
      logError(response)
      return Promise.reject(new Error('接口异常'))
    }
    // 自定义处理【showSuccess 成功提示】：如果需要显示成功提示，则显示成功提示
    if (
      response.config.custom?.showSuccess
      && response.config.custom.successMsg !== ''
      && response.data.code === 200
    ) {
      uni.showToast({
        title: response.config.custom.successMsg,
        icon: 'success',
      })
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    let errorMessage = '网络不给力哦，请稍后再试'
    if (error) {
      if (error.statusCode && ERROR_CODE_MAP[error.statusCode as ErrorCode]) {
        errorMessage = ERROR_CODE_MAP[error.statusCode as ErrorCode]
        // 特殊处理401错误
        if (error.statusCode === 401) {
          handle401Error()
        }
      }

      // 处理超时错误
      if (error.errMsg && error.errMsg.includes('timeout')) {
        errorMessage = '请求超时'
      }
    }

    if (error && error.config) {
      // 显示错误提示
      if (error.config.custom?.showError) {
        showErrorToast(errorMessage, 'none')
      }

      // 关闭loading
      if (error.config.custom?.showLoading) {
        closeLoading()
      }
    }
    logError(error)
    return Promise.reject(new Error('接口异常'))
  },
)

// 401错误处理防抖标志
let handling401 = false

function handle401Error(): void {
  // 防抖处理：如果正在处理401错误，则直接返回
  if (handling401) {
    return
  }
  console.log('handle401Error')
  handling401 = true
  const userStore = useUserStore()
  userStore.resetInfo()

  // 直接使用 uni.navigateTo 避免 throttle 限制
  uni.navigateTo({
    url: '/pages/login/login',
    fail: (e) => {
      console.log('401跳转登录页失败:', e)
      // 如果 navigateTo 失败，尝试使用 reLaunch
      uni.reLaunch({
        url: '/pages/login/login',
      })
    },
  })

  // 延迟重置标志位，防止快速重复触发
  setTimeout(() => {
    handling401 = false
  }, 1000)
}

export default (config: any) => {
  return http.middleware(config)
}

export async function uploadFile(path: string) {
  const userStore = useUserStore()
  const { data } = await uni.uploadFile({
    url: `${import.meta.env.VITE_BASE_URL}iclaim/user/photoUpload2`,
    filePath: path,
    header: {
      Authorization: `Bearer ${userStore.token}`,
    },
    name: 'photo',
  })
  return JSON.parse(data)
}

function logError(response: any) {
  const { config, data } = response

  // 使用 console.group 分组显示错误信息
  console.group('🚨 接口请求错误')

  // 接口基本信息
  console.group('📡 请求信息')
  console.log('📍 接口地址:', config.fullPath)
  console.log('🔧 请求方法:', config.method?.toUpperCase())
  console.log('⏱️  请求时间:', new Date().toLocaleString())
  console.groupEnd()

  // 请求参数
  console.group('📤 请求参数')
  if (config.data) {
    console.log('📦 Data参数:', config.data)
  }
  if (config.params) {
    console.log('🔍 Params参数:', config.params)
  }
  console.groupEnd()

  // 请求头信息
  console.group('📋 请求头')
  console.log('🔑 Token:', config.header?.Authorization ? '已携带' : '未携带')
  if (config.header?.Authorization) {
    console.log('   Token值:', `${config.header.Authorization.substring(0, 20)}...`)
  }
  console.groupEnd()

  // 响应信息
  console.group('📥 响应信息')
  console.log('系统状态码', response.statusCode)
  console.log('📊 状态码:', data.code)
  console.log('💬 错误信息:', data.message)
  console.log('📄 完整响应:', data)
  console.groupEnd()

  console.groupEnd()
}
