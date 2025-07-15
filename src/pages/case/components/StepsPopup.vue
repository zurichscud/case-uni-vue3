<script setup>
const visible = ref(false)
const caseId = ref('')
const steps = ref([])
function open(id, list) {
  visible.value = true
  steps.value = list
  caseId.value = id
}

defineExpose({
  open,
})
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
      <view class="progress-content ml-4 my-10">
        <wd-steps :active="steps.length - 1" vertical>
          <wd-step v-for="(item,index) in steps" :key="`${caseId}-${index}`" :title="item" description=" " />
        </wd-steps>
      </view>
    </view>
  </wd-popup>
</template>

<style scoped lang="scss">
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
