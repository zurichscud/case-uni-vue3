<template>
  <view>
    <view class="box_block" @click="navInto">
      <view class="flex_all magHigt">
        <view class="lefttext"> 团队名称 </view>
        <view class="righttext textblue"> {{ item.nickName }}团队 > </view>
      </view>
      <view class="flex_all magHigt">
        <view class="lefttext"> 团队人数 </view>
        <view class="righttext">
          {{ item.teamSize }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: ['item'],
    methods: {
      navInto() {
        uni.navigateTo({
          url: `/pages/invite/team?id=${this.item.userId}&username=${this.item.nickName}`
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .flex_all {
    display: flex;
    justify-content: space-between;
  }

  .box_block {
    width: 632rpx;
    // height: 218rpx;
    padding: 32rpx;
    background: #ffffff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;

    .righttext {
      color: #999999;
      font-size: 28rpx;
    }

    .lefttext {
      font-size: 28rpx;
      color: #111111;
    }

    .textblue {
      color: #3f9cff;
    }

    .magHigt {
      margin-top: 12rpx;
    }
  }
</style>
