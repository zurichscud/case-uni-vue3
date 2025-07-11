//生产环境
export const isProd = import.meta.env.MODE === 'prod'

//测试环境
export const isTest = import.meta.env.MODE === 'dev'

//仅开发者可见
export const isDev = import.meta.env.DEV
