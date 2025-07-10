import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import AutoImport from 'unplugin-auto-import/vite'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'

// https://vitejs.dev/config/
export default async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return defineConfig({
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        dts: 'src/uni-pages.d.ts',
        dir: 'src/pages/index',
        subPackages: ['src/pages/AI', 'src/pages/case', 'src/pages/chat', 'src/pages/invite', 'src/pages/login', 'src/pages/lpgs', 'src/pages/mcd', 'src/pages/meeting', 'src/pages/pay', 'src/pages/public', 'src/pages/user', 'src/pages/workplace'],
      }),
      /**
       * 构建时: UniHelperLayouts 插件读取 pages.json 中的 layout 属性
运行时: 根据 layout 值自动包装页面到对应的布局组件中
渲染时: 页面内容通过 <slot /> 插入到布局模板中
       */
      //处理layout属性： https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        resolvers: [WotResolver()],
        dts: 'src/components.d.ts',
        dirs: ['src/components', 'src/business'],
        directoryAsNamespace: true,
      }),
      Uni(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ['vue', '@vueuse/core', 'pinia', 'uni-app',
          {
            from: 'uni-mini-router',
            imports: ['createRouter', 'useRouter', 'useRoute'],
          },
          {
            from: 'wot-design-uni',
            imports: ['useToast', 'useMessage', 'useNotify', 'CommonUtil'],
          },
          {
            from: 'alova/client',
            imports: ['usePagination', 'useRequest'],
          }],
        dts: 'src/auto-imports.d.ts',
        //dirs: ['src/composables', 'src/store', 'src/utils', 'src/api'] - 这个配置告诉 AutoImport 插件自动扫描这些目录下的文件，并自动导入其中导出的函数和变量。
        dirs: ['src/composables', 'src/utils', 'src/api'],
        vueTemplate: true,
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
    ],
  })
}
