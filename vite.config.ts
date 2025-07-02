import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import tailwindcss from 'tailwindcss'
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind'
import uniReadPages from './src/libs/uni-read-pages-v3'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // 开发阶段启用源码映射：https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#需主动开启-sourcemap
    sourcemap: process.env.NODE_ENV === 'development',
  },
  plugins: [
    Components({
      resolvers: [WotResolver()],
    }),
    uni(),
    uniTailwind(),
    uniReadPages({
      pagesJsonDir: path.resolve(__dirname, './src/pages.json'),
      includes: ['path', 'aliasPath', 'name', 'meta'],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})
