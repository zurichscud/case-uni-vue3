// pages.config.ts 会自动生成 src/pages.json，这是 uni-app 框架实际使用的配置文件。
// pages.config.ts → vite-plugin-uni-pages → 生成以下文件：
// ├── src/pages.json (uni-app 使用的页面配置)
// ├── src/uni-pages.d.ts (TypeScript 类型定义)
// └── virtual:uni-pages (虚拟模块，供路由使用)
// 项目使用基于文件的路由系统，页面会根据 src/pages/ 目录结构自动生成：
// src/pages/index/index.vue → /pages/index/index
// src/pages/about/index.vue → /pages/about/index
// 页面可以通过 <route> 自定义块添加元数据：
// <route>
// {
//   "name": "demo-page",
//   "style": {
//     "navigationBarTitleText": "演示页面"
//   }
// }
// </route>
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [], // 通常为空，因为使用基于文件的路由系统
  easycom: {
    autoscan: true,
    custom: {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
    }
  },
  globalStyle: {
    // 导航栏配置
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: '理赔公社',

    // 页面背景配置
    backgroundColor: '@bgColor',
    backgroundTextStyle: '@bgTxtStyle',
    backgroundColorTop: '@bgColorTop',
    backgroundColorBottom: '@bgColorBottom',

    // 下拉刷新配置
    enablePullDownRefresh: false,
    onReachBottomDistance: 50,

    // 微信不支持
    // animationType: 'pop-in',
    // animationDuration: 300,
  },
  tabBar: {
    custom: true,
    // #ifdef MP-ALIPAY
    customize: true,
    // 暂时不生效。4.71.2025061206-alpha已修复：https://uniapp.dcloud.net.cn/release-note-alpha.html#_4-71-2025061206-alpha，我们等正式版发布后更新。
    overlay: true,
    // #endif
    height: '0',
    color: '@tabColor',
    selectedColor: '@tabSelectedColor',
    backgroundColor: '@tabBgColor',
    borderStyle: '@tabBorderStyle',
    list: [
      {
        pagePath: 'pages/index/index',
      },
      {
        pagePath: 'pages/index/workplace',
      },
      {
        pagePath: 'pages/index/message',
      },
      {
        pagePath: 'pages/index/user',
      },
    ],
  },
})
