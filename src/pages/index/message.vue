<template>
  <view v-if="!user" class="">
    <none btn="请登录账号后查看~"></none>
  </view>
  <!-- 案件进度通知 -->
  <view v-else class="">
    <view class="flex_box" @click="navTo('caseSpeed')">
      <view class="viewImage">
        <image src="../../static/img8.png" mode="" class="images"></image>
      </view>
      <view class="viewText">
        <view class="flex_alls">
          <view class="newsTitle">案件进度通知</view>
          <view class="newsTime" style="margin-right: 32rpx">
            <text v-if="!!datas.count.caseStatusCount != 0">
              {{ 1 | time }}
            </text>
          </view>
        </view>
        <view class="Tips">
          <view class="TipsText">
            {{ 1 | textContent }}
          </view>
          <view class="textIndex" v-if="!!datas.count.caseStatusCount != 0">
            {{ datas.count.caseStatusCount }}
          </view>
        </view>
      </view>
    </view>
    <!-- 互动消息 -->
    <view class="flex_box" @click="navTo('interaction')">
      <view class="viewImage">
        <image src="../../static/img9.png" mode="" class="images"></image>
      </view>
      <view class="viewText">
        <view class="flex_alls">
          <view class="newsTitle">互动消息</view>
          <view class="newsTime" style="margin-right: 32rpx">
            <text v-if="!!datas.count.interactCount != 0">
              {{ 2 | time }}
            </text>
          </view>
        </view>
        <view class="Tips">
          <view class="">
            <view class="TipsText">
              {{ 2 | textContent }}
            </view>
          </view>
          <view class="textIndex" v-if="!!datas.count.interactCount != 0">
            {{ datas.count.interactCount }}
          </view>
        </view>
      </view>
    </view>
    <!-- 系统消息 -->
    <view class="flex_box" @click="navTo('system')">
      <view class="viewImage">
        <image src="../../static/img49.png" mode="" class="images"></image>
      </view>
      <view class="viewText">
        <view class="flex_alls">
          <view class="newsTitle">系统消息</view>
          <view class="newsTime" style="margin-right: 32rpx">
            <text v-if="!!datas.count.sysCount != 0">
              {{ 0 | time }}
            </text>
          </view>
        </view>
        <view class="Tips">
          <view class="">
            <view class="TipsText">
              {{ 0 | textContent }}
            </view>
          </view>

          <view class="textIndex" v-if="!!datas.count.sysCount != 0">
            {{ datas.count.sysCount }}
          </view>
        </view>
      </view>
    </view>

    <view class="text">· 没有更多消息了 ·</view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/stores'
import * as MessageAPI from '@/apis/message'
const userStore = useUserStore()
const user = computed(() => userStore.user)

async function getMessageData() {
  const { datas } = await MessageAPI.getUnReadMessage({
    userId: userStore.id,
  })
  

}
</script>

<style scoped lang="scss">
.text {
  text-align: center;
  color: #999;
  font-size: 26rpx;
  height: 40rpx;
  line-height: 40rpx;
  margin: 25rpx 0;
}
.images {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
}
.newsTime {
  font-size: 24rpx;
  color: #999;
}
.flex_alls {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.viewImage {
  width: 128rpx;
  height: 128rpx;

  margin: 0 20rpx 0 32rpx;

  flex: 1;
}
.viewText {
  flex: 4;
}
.flex_box {
  display: flex;
  margin: 25rpx 0;
}
.newsTitle {
  font-size: 36rpx;
  font-weight: 600;
  color: #111111;
  margin-top: 10rpx;
}
.flex_between_x {
  display: flex;
  justify-content: space-between;
}
.Tips {
  font-size: 26rpx;
  padding: 22rpx 0;
  color: #999;
  border-bottom: 1rpx solid #dddddd;
  display: flex;
  justify-content: space-between;
}
.TipsText {
  width: 450rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.textIndex {
  width: 40rpx;
  line-height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  background-color: #ff4100;
  margin-right: 32rpx;
  border-radius: 50%;
  color: white;
  font-weight: 300;
}
</style>
