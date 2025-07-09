# MarkdownRenderer 组件

一个功能强大的 Markdown 渲染组件，基于 `marked` 库和 `mp-html` 组件构建，专为 uni-app 项目设计。

## 功能特性

- ✅ 支持标准 Markdown 语法
- ✅ GitHub Flavored Markdown (GFM) 支持
- ✅ 代码高亮和语法着色
- ✅ 表格渲染
- ✅ 图片预览
- ✅ 链接处理
- ✅ 多种主题样式
- ✅ 响应式设计
- ✅ 文本选择和复制

## 基本用法

```vue
<template>
  <MarkdownRenderer :content="markdownContent" />
</template>

<script setup>
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const markdownContent = `
# 标题
这是一段 **粗体** 和 *斜体* 文本。

## 代码示例
\`\`\`javascript
function hello() {
  console.log('Hello World!')
}
\`\`\`

- 列表项 1
- 列表项 2
- 列表项 3
`
</script>
```

## 属性配置

| 属性名        | 类型    | 默认值      | 说明                                   |
| ------------- | ------- | ----------- | -------------------------------------- |
| `content`     | String  | `''`        | Markdown 源内容                        |
| `theme`       | String  | `'default'` | 主题类型：`default`、`thought`、`code` |
| `selectable`  | Boolean | `true`      | 是否可选择文本                         |
| `copyLink`    | Boolean | `false`     | 是否允许链接点击复制                   |
| `previewImg`  | Boolean | `true`      | 是否预览图片                           |
| `showImgMenu` | Boolean | `true`      | 是否显示图片菜单                       |
| `fontSize`    | String  | `'28rpx'`   | 字体大小                               |
| `textColor`   | String  | `'#333'`    | 文字颜色                               |
| `lineHeight`  | String  | `'1.6'`     | 行高                                   |
| `customStyle` | String  | `''`        | 自定义样式                             |

## 主题样式

### default 主题

适用于一般内容展示：

```vue
<MarkdownRenderer :content="content" theme="default" font-size="28rpx" text-color="#333" />
```

### thought 主题

适用于思考过程展示，带有特殊背景和边框：

```vue
<MarkdownRenderer :content="content" theme="thought" font-size="26rpx" text-color="#7d7d7d" />
```

### code 主题

适用于代码展示，使用等宽字体：

```vue
<MarkdownRenderer :content="content" theme="code" font-size="24rpx" />
```

## 事件处理

```vue
<MarkdownRenderer
  :content="content"
  @load="onLoad"
  @ready="onReady"
  @imgtap="onImageTap"
  @linktap="onLinkTap"
/>
```

### 事件说明

- `load`: DOM 结构加载完毕时触发
- `ready`: 所有图片加载完毕时触发
- `imgtap`: 图片被点击时触发
- `linktap`: 链接被点击时触发

## 支持的 Markdown 语法

### 文本格式

- **粗体文本**：`**粗体**` 或 `__粗体__`
- _斜体文本_：`*斜体*` 或 `_斜体_`
- ~~删除线~~：`~~删除线~~`
- `内联代码`：`` `代码` ``

### 标题

```markdown
# 一级标题

## 二级标题

### 三级标题
```

### 列表

```markdown
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2
```

### 代码块

````markdown
```javascript
function example() {
  return 'Hello World'
}
```
````

### 表格

```markdown
| 列 1   | 列 2   | 列 3   |
| ------ | ------ | ------ |
| 数据 1 | 数据 2 | 数据 3 |
| 数据 4 | 数据 5 | 数据 6 |
```

### 引用

```markdown
> 这是一段引用文本
> 可以跨越多行
```

### 链接和图片

```markdown
[链接文本](https://example.com)
![图片描述](https://example.com/image.jpg)
```

## 在 AI 聊天中的使用

在 AI 聊天界面中，组件会自动处理 AI 回复的 Markdown 内容：

```vue
<template>
  <!-- AI 思考过程 -->
  <MarkdownRenderer
    :content="item.msg.thought"
    theme="thought"
    font-size="26rpx"
    text-color="#7d7d7d"
  />

  <!-- AI 回复内容 -->
  <MarkdownRenderer :content="item.msg.reply" theme="default" font-size="28rpx" text-color="#333" />
</template>
```

## 性能优化

- 内置缓存机制，避免重复解析相同内容
- 懒加载图片支持
- 响应式更新，只在内容变化时重新渲染

## 注意事项

1. 确保项目已安装 `marked` 依赖：`npm install marked`
2. 组件内部使用了 `mp-html`，适配微信小程序环境
3. 自定义样式请通过 `customStyle` 属性传入
4. 图片链接建议使用 HTTPS 协议

## 扩展开发

如需添加新的主题或自定义样式处理，可以修改组件内的 `getThemeStyles` 函数和 `convertMarkdownToHtml` 函数。
