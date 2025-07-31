<script setup>
const query = defineProps({
  name: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <view>
    <view>{{ name }}邀请您加入他的团队</view>
    <wd-button block>确认加入团队</wd-button>
  </view>
</template>

<style scoped></style>

<route lang="json">
{
  "name": "inviteYou",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "邀请加入理赔公社"
  }
}
</route>
