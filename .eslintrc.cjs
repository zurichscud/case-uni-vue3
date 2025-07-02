/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  // 小程序全局变量
  globals: {
    uni: true,
    wx: true,
    WechatMiniprogram: true,
    getCurrentPages: true,
    getApp: true,
    UniApp: true,
    UniHelper: true,
    App: true,
    Page: true,
    Component: true,
    AnyObject: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // any类型检查
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'no-unreachable': 'off',
    'comma-dangle': 'off', // 尾部检查
    'no-extra-semi': 'off', // 不必要的分号
    semi: [0], // 关闭语句强制分号结尾
    'no-multiple-empty-lines': [0, { max: 100 }], //空行最多不能超过100行
    'no-mixed-spaces-and-tabs': [0], //关闭禁止混用tab和空格
    quotes: 'off', // 禁用引号类型检查
    'space-before-function-paren': 'off', //函数定义时括号前面要不要有空格
    'vue/attributes-order': 'off', // 关闭属性顺序检查
    'prettier/prettier': 'off', // 关闭prettier
    curly: ['error', 'all'], // 强制所有控制语句使用一致的括号风格
    'vue/no-v-model-argument': 'off', // 关闭属性必须是短横线连接
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'ignore',
      },
    ],
  },
}
