<script setup>
defineProps({
  openType: {
    type: String,
    default: '',
  },
  // 客服会话来源
  sessionFrom: {
    type: String,
    default: '',
  },
  // 会话内消息卡片标题
  sendMessageTitle: {
    type: String,
    default: '',
  },
  // 会话内消息卡片点击跳转小程序路径
  sendMessagePath: {
    type: String,
    default: '',
  },
  // 会话内消息卡片图片
  sendMessageImg: {
    type: String,
    default: '',
  },
  // 打开 APP 时，向 APP 传递的参数
  appParameter: {
    type: String,
    default: '',
  },
  // 指定返回用户信息的语言
  lang: {
    type: String,
    default: 'zh_CN',
  },
})

// 定义事件
defineEmits([
  'getphonenumber',
  'getuserinfo',
  'error',
  'opensetting',
  'launchapp',
  'contact',
  'chooseavatar',
])
</script>

<template>
  <view class="open-type-container">
    <!-- 透明的button用于触发开放能力 -->
    <button
      :open-type="openType"
      :session-from="sessionFrom"
      :send-message-title="sendMessageTitle"
      :send-message-path="sendMessagePath"
      :send-message-img="sendMessageImg"
      :app-parameter="appParameter"
      :lang="lang"
      class="open-type-button"
      @getphonenumber="$emit('getphonenumber', $event)"
      @getuserinfo="$emit('getuserinfo', $event)"
      @error="$emit('error', $event)"
      @opensetting="$emit('opensetting', $event)"
      @launchapp="$emit('launchapp', $event)"
      @contact="$emit('contact', $event)"
      @chooseavatar="$emit('chooseavatar', $event)"
    />
    <!-- 实际显示的内容通过插槽传入 -->
    <view class="content-wrapper">
      <slot />
    </view>
  </view>
</template>

<style scoped>
.open-type-container {
  position: relative;
}

.open-type-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  z-index: 1;
  /* 确保button不影响容器尺寸 */
  box-sizing: border-box;
}

/* 重置button的默认样式 */
.open-type-button::after {
  border: none;
}

.content-wrapper {
  position: relative;
  z-index: 0;
  /* 确保内容正常显示 */
  width: 100%;
  height: 100%;
}
</style>
