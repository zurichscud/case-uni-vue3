<template>
  <view>
    <view v-if="msgList?.length === 0">
      <none name="暂无最新通知~"></none>
    </view>
    <view v-else class="box_padd">
      <view v-for="(item, index) in msgList" :key="index" class="for_blaock">
        <view class="sp_Top">
          <view class="sp_title">
            {{ item.content }}
          </view>
          <view class="sp_time">
            {{ item.gmtCreate }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import * as MessageAPI from '@/apis/message'
import { useUserStore } from '@/stores'

const msgList = ref([])

const userStore = useUserStore()

async function getMessageListData() {
  const res = await MessageAPI.getMessageList({
    userId: userStore.id,
    category: 0,
    pageNum: 1,
    pageSize: 5,
  })
  msgList.value = res.rows
}

onShow(() => {
  getMessageListData()
})
</script>

<style scoped lang="scss">
.box_padd {
  padding: 0 32rpx;
  padding-bottom: 50rpx;
  .for_blaock {
    margin-top: 24rpx;
    background-color: white;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;
    color: #848484;
    text-align: left;
    padding: 0 36rpx;

    .sp_btm_lef {
      font-size: 28rpx;
      color: #999999;
    }
    .sp_btm {
      padding: 20rpx 0;
      display: flex;
      width: 100%;
      justify-content: space-between;
      border-top: 2rpx solid #eeeeee;
    }
    .sp_title {
      color: #111111;
      font-size: 32rpx;
      font-weight: 600;
    }
    .sp_time {
      font-size: 24rpx;
      line-height: 60rpx;
    }
    .sp_Top {
      padding: 20rpx 0;
    }
  }
}
</style>
