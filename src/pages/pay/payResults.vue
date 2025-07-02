<template>
  <view>
    <view class="main_info">
      <view class="">
        <!-- succstatu -->
        <image
          :src="
            numPay
              ? 'https://app.y9net.cn/data/01/46/wKgBNmXgMcmAdd9xAAA8ye4eLYM504.png'
              : '../../static/err_pay_icon.png'
          "
          mode=""
          class="statu"
        ></image>
      </view>
      <view class="pay_statu">
        {{ numPay ? '支付成功' : '支付失败' }}
      </view>
      <view class="pay_num"> 微信付款{{ numPay ? numPay : '0' }}元 </view>
      <template v-if="!!numPay">
        <view class="flex_btn_nav" v-if="!!caseId">
          <view class="flex_btn flex_nav_case" @click="navTo('chatWith')"> 进入聊天室 </view>
          <view class="flex_btn flex_nav_index" @click="navTo()"> 返回首页 </view>
        </view>
        <view class="flex_btn_nav" v-else>
          <view class="flex_btn flex_nav_case" @click="navTo('videoIntroduction')"> 查看详情 </view>
          <view class="flex_btn flex_nav_index" @click="navTo()"> 返回首页 </view>
        </view>
      </template>

      <view class="fixed_bottom" @click="navTo()" v-else> 返回首页 </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        caseId: null,
        numPay: null
      }
    },
    onLoad(options) {
      if (!!options?.payNum) {
        this.numPay = options.payNum
        console.log(options?.caseId, '支付结果')
        this.caseId = options?.caseId
      }
    },
    methods: {
      navTo(flag = false) {
        if (!!flag) {
          if (flag == 'chatWith') {
            uni.reLaunch({
              url: `/pages/deprecated/chatroom?caseId=${this.caseId}`
            })
          } else if (flag == 'videoIntroduction') {
            uni.reLaunch({
              url: `/pagesB/videoPage/courseSelection`
            })
          } else {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        } else {
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .main_info {
    text-align: center;
    margin: 32rpx 32rpx;
    width: 686rpx;
    height: 442rpx;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border: 1px solid transparent;
    border-radius: 20rpx;
    .pay_num {
      color: #999999;
      font-size: 28rpx;
    }
    .pay_statu {
      font-size: 36rpx;
      color: #111111;
      margin-bottom: 10rpx;
    }
    .statu {
      width: 160rpx;
      height: 160rpx;
      margin-top: 82rpx;
    }
  }
  .flex_btn_nav {
    position: fixed;
    bottom: 100rpx;
    z-index: 100;
    .flex_btn {
      box-sizing: border-box;
      text-align: center;
      width: 686rpx;
      height: 100rpx;
      border-radius: 200px;
      line-height: 100rpx;
      margin: 30rpx 0;
    }
    .flex_nav_index {
      border: 2px solid #3f9cff;
      color: #3f9cff;
      line-height: 96rpx;
    }
    .flex_nav_case {
      background-color: #3f9cff;
      color: #fff;
    }
  }
  .fixed_bottom {
    width: 686rpx;
    height: 124rpx;
    background: linear-gradient(270deg, #3f9cff 6%, #7abaff 100%);
    border-radius: 20rpx;
    color: white;
    line-height: 124rpx;
    text-align: center;
    position: fixed;
    bottom: 128rpx;
  }
</style>
