/**
 * stylelint 目前只在webstorm中才生效，vscode中不生效，具体原因未知
 * https://juejin.cn/post/7456050360408703030
 */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue',
    'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化
  ],
  plugins: ['stylelint-order'],
  rules: {
    // 指定声明块内属性的顺序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      // Flexbox相关属性
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'align-self',
      'align-content',
      'order',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'border',
      'border-style',
      'border-width',
      'border-color',
      'border-top',
      'border-top-style',
      'border-top-width',
      'border-top-color',
      'border-right',
      'border-right-style',
      'border-right-width',
      'border-right-color',
      'border-bottom',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-color',
      'border-left',
      'border-left-style',
      'border-left-width',
      'border-left-color',
      'border-radius',
      'background',
      'background-color',
      'background-image',
      'background-repeat',
      'background-position',
      'background-size',
      'color',
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'text-justify',
      'text-indent',
      'text-overflow',
      'text-decoration',
      'white-space',
      'vertical-align',
      'cursor',
      'opacity',
    ],
    // 允许 global 关键字
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    // 允许空源
    'no-empty-source': null,
    // 允许未知单位
    'unit-no-unknown': null,
    // 允许未知属性
    'property-no-unknown': null,
    // 允许未知伪类选择器
    'selector-pseudo-element-no-unknown': null,
    // 允许未知伪元素选择器
    'selector-type-no-unknown': null,
    // 允许未知规则
    'at-rule-no-unknown': null,
    // 允许未知函数
    'function-no-unknown': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
}
