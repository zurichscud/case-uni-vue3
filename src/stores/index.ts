import { createPinia } from 'pinia'
// 创建 pinia 实例
const pinia = createPinia()

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export * from './modules/user'
export * from './modules/message'
export * from './modules/app'
