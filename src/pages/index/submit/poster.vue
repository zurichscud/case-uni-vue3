<!-- 理赔有纠纷，理赔公社来帮忙 -->
<template>
  <view class="backimg" style="">
    <view class="title">
      <view class="title_text"> 理赔有纠纷 </view>
      <view class="title_text"> <text class="text_color">理赔公社</text>来帮忙 </view>
    </view>

    <view class="pontion_abbtm">
      <view class="btm_text"> 人均20年以上理赔经验专家 </view>
      <view class="btm_text"> 为客户提供专业服务 </view>
    </view>
    <view class="pontion_btm">
      <view class="btm_btn submit" @tap="handleSubmit"> 开始提交 </view>
      <view class="btm_btn invitation" @tap="handleShare"> 邀请客户提交案件 </view>
    </view>
  </view>
</template>

<script setup>
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

function handleShare() {
  uni.showToast({
    title: '敬请期待',
    icon: 'none',
  })
}
</script>
<style scoped lang="scss">
  .backimg {
    width: 100%;
    height: 1624rpx;
    background-image: url('https://app.y9net.cn/data/01/38/wKgBNmPpr8OAJjttAAVPCNiY4W0360.png');
    background-repeat: no-repeat;
    background-size: cover;
    display: flow-root;
    position: relative;

    .title {
      margin-top: 46rpx;

      .title_text {
        text-align: center;
        font-family:
          Alibaba PuHuiTi 2-105 Heavy,
          Alibaba PuHuiTi 20;
        font-weight: 900;
        color: #1460ff;

        font-size: 72rpx;
        line-height: 100rpx;
        -webkit-background-clip: text;

        .text_color {
          color: #ffb200;
        }
      }
    }
    .pontion_abbtm {
      text-align: center;
      color: white;
      position: absolute;
      bottom: 330rpx;
      width: 100%;
      .btm_text {
        font-size: 32rpx;
        font-family:
          Alibaba PuHuiTi 2-65 Medium,
          Alibaba PuHuiTi 20;
        line-height: 22px;
      }
    }
    .pontion_btm {
      text-align: center;
      color: white;
      position: fixed;
      bottom: 60rpx;
      width: 100%;
      .btm_text {
        font-size: 32rpx;
        font-family:
          Alibaba PuHuiTi 2-65 Medium,
          Alibaba PuHuiTi 20;
        line-height: 22px;
      }
      .btm_btn {
        width: 580rpx;
        height: 88rpx;
        line-height: 84rpx;
        border-radius: 120rpx;
        box-sizing: border-box;
        margin: 32rpx auto;
      }
      .invitation {
        border: 2px solid white;
        background: rgb(20, 96, 255);
      }

      .submit {
        background-color: white;
        color: #1460ff;
        border: 2px solid #1460ff;
        border-radius: 120rpx;
      }
      .item {
        opacity: 0;
        position: absolute;
        width: 580rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 120rpx;
        box-sizing: border-box;
        margin: 0 auto;
        left: 0;
        right: 0;
        bottom: 33rpx;
      }
    }
  }
</style>
