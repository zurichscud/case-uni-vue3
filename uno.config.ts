import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni({
      attributify: {
        prefixedOnly: true,
      },
    }),
    // 暂时禁用 presetIcons 以避免图标加载错误
    // presetIcons({
    //   scale: 1.2,
    //   warn: true,
    //   extraProperties: {
    //     'display': 'inline-block',
    //     'vertical-align': 'middle',
    //   },
    //   // HBuilderX 必须针对要使用的 Collections 做异步导入
    //   // collections: {
    //   //   carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
    //   // },
    // }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme:{
    fontFamily:{
      number: ['SF Mono', 'Consolas', 'monospace']
    }
  }
})
