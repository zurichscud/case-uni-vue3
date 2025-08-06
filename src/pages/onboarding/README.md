# CoinBase 引导页实现

基于 Figma 设计实现的 CoinBase 应用引导页面（Onboarding 4）。

## 📋 功能特性

- ✅ **高度还原设计**: 完全按照 Figma 设计图实现
- ✅ **状态栏样式**: 仿 iPhone X 状态栏设计
- ✅ **渐变效果**: 标题文字和按钮的渐变色效果
- ✅ **交互动画**: 按钮点击动画和分页指示器动画
- ✅ **响应式适配**: 支持不同屏幕尺寸
- ✅ **SVG 插画**: 集成了 Figma 设计中的移动支付插画

## 🎨 设计规范

### 颜色系统
- **主渐变色**: `linear-gradient(135deg, #FD749B 0%, #281AC8 100%)`
- **背景色**: `#FFFBF7` (奶油白)
- **文字颜色**: `#333333` (深灰)
- **状态栏背景**: `#262628` (深灰)

### 字体规范
- **标题字体**: Poppins Bold 24px
- **副标题字体**: Poppins Regular 15px
- **按钮字体**: Poppins Bold 15px
- **时间字体**: SF Pro Display/Roboto Black 15px

### 尺寸规范
- **页面尺寸**: 375px × 812px (iPhone X)
- **状态栏高度**: 44px
- **按钮尺寸**: 193px × 43px
- **插画尺寸**: 271px × 213px

## 📁 文件结构

```
src/pages/onboarding/
├── onboarding.vue     # 主引导页面
├── demo.vue          # 演示页面
├── README.md         # 说明文档
└── static/
    └── mobile_payments.svg  # 移动支付插画
```

## 🚀 使用方法

### 直接访问
```javascript
// 跳转到引导页
router.push('/pages/onboarding/onboarding')

// 跳转到演示页面
router.push('/pages/onboarding/demo')
```

### 在应用中集成
```vue
<script setup>
import router from '@/utils/router'

// 首次启动时显示引导页
function showOnboarding() {
  router.push('/pages/onboarding/onboarding')
}
</script>
```

## 🔧 自定义配置

### 修改步骤数量
在 `onboarding.vue` 中修改：
```javascript
const currentStep = ref(3)  // 当前步骤 (0-based)
const totalSteps = 4       // 总步骤数
```

### 修改按钮行为
```javascript
function handleContinue() {
  if (currentStep.value < totalSteps - 1) {
    // 下一步逻辑
    currentStep.value++
  } else {
    // 完成引导的跳转逻辑
    router.replace('/pages/index/index')
  }
}
```

### 修改文案内容
在模板中修改对应的文字内容：
```vue
<text class="main-title">您的标题文字</text>
<text class="subtitle">您的副标题文字</text>
<text class="continue-text">按钮文字</text>
```

## 🎯 响应式适配

页面支持以下屏幕尺寸：
- iPhone X/11/12 系列 (375px)
- 小屏设备 (≤400px)
- 平板设备 (自适应)

### 小屏优化
- 文字大小自动调整
- 按钮宽度自适应
- 内边距动态调整

## 🔍 技术实现

### 渐变文字效果
```scss
.main-title {
  background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  // 降级处理
  @supports not (background-clip: text) {
    color: #281AC8;
  }
}
```

### 分页指示器
```scss
.dot {
  &.filled {
    background: linear-gradient(135deg, #FD749B 0%, #281AC8 100%);
  }

  &:not(.filled) {
    background: #FFFBF7;
    border: 2px solid;
    border-image: linear-gradient(135deg, #FD749B 0%, #281AC8 100%) 1;
  }

  &.active {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(253, 116, 155, 0.4);
  }
}
```

### 按钮波纹效果
```scss
.continue-btn {
  &::before {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: width 0.6s, height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
}
```

## 🐛 常见问题

### Q: 渐变文字不显示？
A: 检查浏览器兼容性，老版本浏览器会自动降级显示纯色文字。

### Q: SVG 图片不显示？
A: 确保 SVG 文件路径正确，并且在 static 目录中。

### Q: 状态栏在某些设备上显示异常？
A: 这是正常现象，不同设备的状态栏样式会有差异。

### Q: 如何适配深色模式？
A: 可以通过媒体查询或 CSS 变量来实现深色模式适配。

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件。
