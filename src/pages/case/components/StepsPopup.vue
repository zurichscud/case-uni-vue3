<script setup>
const visible = defineModel('modelValue', { type: Boolean })
</script>

<template>
  <wd-popup
    v-model="visible"
    position="bottom"
    :safe-area-inset-bottom="true"
    closable
    custom-style="border-radius: 30rpx 30rpx 0 0;"
  >
    <view class="progress-popup">
      <view class="progress-header">
        <text class="progress-title">案件进程</text>
      </view>
      <!-- 步骤条 -->
      <view class="progress-content ml-4">
        <wd-steps :active="1" vertical>
          <wd-step description="注册1个账号" />
          <wd-step description="登录账号并绑定手机" />
          <wd-step description="完善个人信息" />
        </wd-steps>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
// 办理进程弹窗样式
.progress-popup {
  max-height: 80vh;
  padding: 0 30rpx 30rpx;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 30rpx;

  .progress-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1a1a1a;
  }
}
.progress-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
