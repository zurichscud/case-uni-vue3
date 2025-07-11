import uni from '@uni-helper/eslint-config'

export default uni({
  unocss: true,
  rules: {
    'no-console': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
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
    'vue/html-self-closing': 'off',
    'import/order': 'off',
    'sort-imports': 'off',
    'vue/prefer-template': 'off',
    'unocss/order-attributify': 'off',
    'unocss/order-classnames': 'off',
  },
})
