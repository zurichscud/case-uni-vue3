<!-- 邀请好友享两大福利 -->
<template>
  <view class="invite">
    <image
      lazy-load
      mode="widthFix"
      :src="'https://iclaim.oss-cn-beijing.aliyuncs.com/2025/01/1a45d78411cd4eca8f7b59735996f212.png'"
    >
    </image>
    <button class="wx_code" @click="openWxCode">申请成为分社社长</button>
    <!-- <u-popup
      :show="showPopup"
      bgColor="transparent"
      :round="10"
      :closeable="true"
      mode="center"
      @close="closePopup"
    >
      <view class="popup-content" @click="viewImage">
        <image
          class="popup-image"
          src="https://app.y9net.cn/data/01/47/wKgBNmZVMTSAJdfvAAHyEYFTH8k979.jpg"
          mode="widthFix"
        />
        <image
          class="popup-image"
          src="https://app.y9net.cn/data/01/47/wKgBNmZVTgCAHxQ8AAJGY8sYbNQ37.jpeg"
          mode="widthFix"
        />
      </view>
    </u-popup> -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        showPopup: false,
        imgs: [
          'https://app.y9net.cn/data/01/47/wKgBNmZVMTSAJdfvAAHyEYFTH8k979.jpg',
          'https://app.y9net.cn/data/01/47/wKgBNmZVTgCAHxQ8AAJGY8sYbNQ37.jpeg'
        ]
      }
    },
    onLoad(options) {
      if (options?.pid) {
        uni.setStorageSync('pid', options.pid)
      }
    },
    methods: {
      openPdf(type) {
        uni.downloadFile({
          url:
            type === 1
              ? 'https://app.y9net.cn/data/01/35/wKgBNmOaiDmABtsvAALW5XW0BVg197.pdf'
              : 'https://app.y9net.cn/data/01/35/wKgBNmOadJaADjD8AAPqITMmQZs194.pdf',
          success: (res) => {
            if (res.statusCode === 200) {
              let filePath = res.tempFilePath
              uni.openDocument({
                filePath: filePath,
                showMenu: true,
                success: function (res) {}
              })
            }
          }
        })
      },
      openWxCode() {
        this.showPopup = true
      },
      onShareAppMessage() {
        return {
          title: '快来和我一起加入理赔公社吧',
          path: `/pages/index/index?pid=${this.user.id}`,
          imageUrl: 'https://app.y9net.cn/data/01/33/wKgBNmNrSeSAbR2TAAEp5UKyBy8155.png',
          success(res) {
            console.log('分享成功', res)
          }
        }
      },
      closePopup() {
        this.showPopup = false
      },
      viewImage() {
        uni.previewImage({
          current: 0,
          urls: this.imgs
        })
      }
    }
  }
</script>

<style lang="scss">
  .invite {
    position: relative;

    image {
      width: 100%;
      vertical-align: middle;
    }
  }

  .popup_box {
    width: 70%;
    height: 500rpx;
  }

  .wx_code {
    position: absolute;
    width: 381rpx;
    height: 125rpx;
    opacity: 0;
    background-color: red;
    bottom: 118rpx;
    left: 178rpx;
  }

  .popup-content {
    width: 400rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
</style>
