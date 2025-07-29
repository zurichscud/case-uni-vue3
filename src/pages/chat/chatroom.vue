<script setup>
import messages from './data/data'
import dayjs from 'dayjs'

const robotAvatar = 'https://app.y9net.cn/images/imgs/icon_xiaoyi3.png'
const nowTime = dayjs().format('HH:mm')
// 预览图片
function previewImage(url) {
  uni.previewImage({
    urls: [url],
    current: url,
  })
}

function handleSubmit() {
  wx.openCustomerServiceChat({
    extInfo: {
      url: 'https://work.weixin.qq.com/kfid/kfc0661c6f158062ace'
    },
    corpId: 'ww0defd58c63edff8e',
    success(res) {
      console.log('success', res)
    },
    fail(res) {
      console.log('fail', res)
    },
  })
}
</script>

<template>
  <view class="h-screen bg-gray-100 flex flex-col pb-4 box-border">
    <!-- 顶部标题栏 -->
    <!-- <view class="py-4 px-2 bg-blue-500 text-white shadow-md">
      <text class="text-lg font-bold">在线客服</text>
      <text class="text-xs block mt-1">客服工作时间: 9:00-18:00</text>
    </view> -->

    <!-- 聊天消息区域 -->
    <scroll-view
      scroll-y="true"
      class="overflow-auto mx-2 h-full flex-1"
    >
      <wd-gap ></wd-gap>
      <view class="text-center text-xs text-gray-500 mb-4">{{ nowTime }}</view>
      <!-- robot message -->
      <view
        v-for="(msg, index) in messages"
        :key="index"
        :id="'msg-' + index"
        class="mb-3"
        :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
      >
        <!-- 客服消息 -->
        <view v-if="msg.sender === 'service'" class="flex items-start">
          <image :src="robotAvatar" class="w-10 h-10 rounded-full mr-2" />
          <view class="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[75%]">
            <!-- 文本消息 -->
            <view v-if="msg.msgType === 1">
              <text class="text-gray-800">
                {{ msg.content }}
              </text>
            </view>
            <!-- 图片消息 -->
            <view v-else-if="msg.msgType === 2" >
              <image
                :src="msg.content"
                class=" rounded-lg  max-w-[300rpx]"
                mode="widthFix"
                @click="previewImage(msg.content)"
              />
            </view>
          </view>
        </view>

        <!-- 用户消息 -->
        <view v-if="msg.sender === 'user'" class="flex items-end justify-end max-w-[80%] ml-auto">
          <view class="bg-blue-500 p-3 rounded-xl rounded-tr-none shadow-sm">
            <!-- 文本消息 -->
            <view v-if="msg.msgType === 1">
              <text class="text-white">
                {{ msg.content }}
              </text>
            </view>
            <!-- 图片消息 -->
            <view v-else-if="msg.msgType === 2" class="max-w-[300px]">
              <image
                :src="msg.content"
                class="w-full rounded-lg cursor-pointer"
                mode="widthFix"
                @click="previewImage(msg.content)"
              />
            </view>
          </view>
          <image src="/static/user-avatar.png" class="w-10 h-10 rounded-full ml-2" />
        </view>
      </view>
    </scroll-view>

    <!-- 转企业微信-->
    <view class="px-4">
      <wd-button block size="large" @click="handleSubmit">
        <text class="iconfont icon-kefu1 mr-2"></text>
        联系客服
      </wd-button>
    </view>
  </view>
</template>

<style>
/* 确保滚动视图正确工作 */
scroll-view {
  display: flex;
  flex-direction: column;
}
</style>

<route lang="json">
{
  "name": "chatroom",
  "layout": "default",
  "auth": true,
  "style": {
    "navigationBarTitleText": "提交案件"
  }
}
</route>
