/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明由vite.config.ts中uniReadPagesV3Plugin插件定义的全局变量
declare const ROUTES: {
  path: string
  aliasPath?: string
  name?: string
  meta?: Record<string, any>
}[]

declare const ROUTES_MAP: Record<
  string,
  {
    path: string
    aliasPath?: string
    name?: string
    meta?: Record<string, any>
  }
>

declare const TABBAR: string[]
