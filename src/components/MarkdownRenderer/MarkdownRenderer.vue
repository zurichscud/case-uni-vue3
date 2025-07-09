<template>
  <mp-html
    :content="renderedHtml"
    :selectable="selectable"
    :copy-link="copyLink"
    :container-style="computedStyle"
    :preview-img="previewImg"
    :show-img-menu="showImgMenu"
    @load="onLoad"
    @ready="onReady"
    @imgtap="onImgTap"
    @linktap="onLinkTap"
  ></mp-html>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

// Props 定义
const props = defineProps({
  // Markdown 源内容
  content: {
    type: String,
    default: '',
  },
  // 是否可选择文本
  selectable: {
    type: Boolean,
    default: true,
  },
  // 是否允许链接点击复制
  copyLink: {
    type: Boolean,
    default: false,
  },
  // 是否预览图片
  previewImg: {
    type: Boolean,
    default: true,
  },
  // 是否显示图片菜单
  showImgMenu: {
    type: Boolean,
    default: true,
  },
  // 自定义样式
  customStyle: {
    type: String,
    default: '',
  },
  // 字体大小
  fontSize: {
    type: String,
    default: '28rpx',
  },
  // 文字颜色
  textColor: {
    type: String,
    default: '#333',
  },
  // 行高
  lineHeight: {
    type: String,
    default: '1.6',
  },
})

// Events 定义
const emit = defineEmits(['load', 'ready', 'imgtap', 'linktap'])

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true, // 支持 GitHub Flavored Markdown
  headerIds: false, // 禁用标题ID
  mangle: false, // 禁用标题混淆
})

// 将 markdown 转换为 HTML
const convertMarkdownToHtml = (markdown) => {
  if (!markdown) {
    return ''
  }

  try {
    let html = marked(markdown)

    // 为代码块添加更好的样式
    html = html.replace(
      /<pre><code class="language-(\w+)">/g,
      '<pre style="background-color: #f6f8fa; padding: 16rpx; border-radius: 12rpx; overflow-x: auto; margin: 16rpx 0; border: 1px solid #e1e4e8;"><code class="language-$1" style="font-family: Consolas, Monaco, \'Courier New\', monospace; font-size: 26rpx; color: #24292e; display: block; white-space: pre;">',
    )

    // 为无语言标识的代码块添加样式
    html = html.replace(
      /<pre><code>/g,
      '<pre style="background-color: #f6f8fa; padding: 16rpx; border-radius: 12rpx; overflow-x: auto; margin: 16rpx 0; border: 1px solid #e1e4e8;"><code style="font-family: Consolas, Monaco, \'Courier New\', monospace; font-size: 26rpx; color: #24292e; display: block; white-space: pre;">',
    )

    // 为内联代码添加样式
    html = html.replace(
      /<code>([^<]*)<\/code>/g,
      '<code style="background-color: #f6f8fa; padding: 4rpx 8rpx; border-radius: 6rpx; font-family: Consolas, Monaco, \'Courier New\', monospace; font-size: 26rpx; color: #e83e8c; border: 1px solid #e1e4e8;">$1</code>',
    )

    // 为表格添加样式
    html = html.replace(
      /<table>/g,
      '<table style="border-collapse: collapse; width: 100%; margin: 16rpx 0; border: 1px solid #d1d9e0; background-color: #fff;">',
    )

    html = html.replace(
      /<th>/g,
      '<th style="border: 1px solid #d1d9e0; padding: 12rpx 16rpx; background-color: #f6f8fa; text-align: left; font-weight: 600; color: #24292e;">',
    )

    html = html.replace(
      /<td>/g,
      '<td style="border: 1px solid #d1d9e0; padding: 12rpx 16rpx; color: #24292e;">',
    )

    // 为标题添加样式
    html = html.replace(
      /<h([1-6])>/g,
      '<h$1 style="margin: 24rpx 0 16rpx 0; font-weight: 600; line-height: 1.4; color: #24292e;">',
    )

    // 为列表添加样式
    html = html.replace(
      /<ul>/g,
      '<ul style="margin: 16rpx 0; padding-left: 32rpx; color: #24292e;">',
    )

    html = html.replace(
      /<ol>/g,
      '<ol style="margin: 16rpx 0; padding-left: 32rpx; color: #24292e;">',
    )

    html = html.replace(/<li>/g, '<li style="margin: 8rpx 0; line-height: 1.6;">')

    // 为段落添加样式
    html = html.replace(/<p>/g, '<p style="margin: 16rpx 0; line-height: 1.6; color: inherit;">')

    // 为引用块添加样式
    html = html.replace(
      /<blockquote>/g,
      '<blockquote style="margin: 16rpx 0; padding: 16rpx; background-color: #f6f8fa; border-left: 8rpx solid #0969da; color: #656d76; font-style: italic;">',
    )

    // 为链接添加样式
    html = html.replace(/<a /g, '<a style="color: #0969da; text-decoration: underline;" ')

    // 为强调文本添加样式
    html = html.replace(/<strong>/g, '<strong style="font-weight: 600; color: inherit;">')

    html = html.replace(/<em>/g, '<em style="font-style: italic; color: inherit;">')

    return html
  } catch (error) {
    console.error('Markdown 解析错误:', error)
    return markdown // 如果解析失败，返回原始文本
  }
}

// 计算渲染后的 HTML
const renderedHtml = computed(() => {
  return convertMarkdownToHtml(props.content)
})

// 计算最终样式
const computedStyle = computed(() => {
  const baseStyle = `
    font-size: ${props.fontSize};
    color: ${props.textColor};
    line-height: ${props.lineHeight};
    word-break: break-word;
    overflow-wrap: break-word;
    background-color: transparent;
    padding: 0;
    border: none;
  `

  return `${baseStyle} ${props.customStyle}`
})

// 事件处理
const onLoad = () => {
  emit('load')
}

const onReady = () => {
  emit('ready')
}

const onImgTap = (event) => {
  emit('imgtap', event)
}

const onLinkTap = (event) => {
  emit('linktap', event)
}

// 暴露方法给父组件
defineExpose({
  getOriginalContent: () => props.content,
  getRenderedHtml: () => renderedHtml.value,
})
</script>

<style lang="scss" scoped>
// 组件本身不需要额外样式，所有样式通过 mp-html 的 container-style 传入
</style>
