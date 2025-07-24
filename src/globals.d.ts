//globals.d.ts 是 TypeScript 的全局声明文件，放在 src/ 下即可自动生效（无需 import）。
//这样做后，ROUTES_MAP 和 TABBAR 在任何 ts/tsx/vue 文件中都能直接用，并有类型提示。
interface ROUTE {
  path: string
  name: string
  auth?: boolean
  dev?: boolean
}

declare const ROUTES_MAP: Record<string, ROUTE>
declare const TABBAR: string[]
