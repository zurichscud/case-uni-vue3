<template>
  <view>
    <view class="boxuser">
      <view class="title"> 请上传证明 </view>
      <view class="imginfo">
        请上传岗位证、职业资格证、获奖证明等能证明现在或曾经从事过保险行业的证明
      </view>
      <view class="loadImg" @click="loadImg" v-if="!urlImg">
        <image class="img_show" src="../../static/xiangji.png" mode=""></image>
      </view>
      <view style="position: relative" @click="previewImage" v-if="!!urlImg">
        <image :src="urlImg" class="loadPhoto" mode="aspectFill"></image>
        <view class="boxX" @click.stop="delImg">
          <image src="../../static/close.png" mode="" class="box_img"></image>
        </view>
      </view>
      <view class="">
        <view class="imginfo">
          <image
            style="
              width: 32rpx;
              height: 32rpx;
              vertical-align: middle;
              position: relative;
              top: -5rpx;
            "
            src="../../static/alert.png"
            mode=""
          ></image>
          上传图片只用于认证
        </view>
      </view>
      <view class="btnonImg" :class="[urlImg && !flay ? 'active' : '']" @click="onloadImg">
        下一步
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        urlImg: null,
        id: null,
        flay: false
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.fetchUser()
    },
    methods: {
      async fetchUser() {
        let res = await this.$api.getUpgradeByUserId({
          userId: this.user.id
        })
        if (!!res.data) {
          ;(this.id = res.data.id), (this.urlImg = res.data.photoUrl)
          this.flay = true
        }
      },
      previewImage() {
        // 预览图片''
        let that = this
        console.log('查看图片地址')
        let dataUrl = [that.urlImg]
        console.log(dataUrl)
        uni.previewImage({
          urls: dataUrl,
          longPressActions: {
            itemList: ['发送给朋友', '保存图片', '收藏'],
            success: function (data) {
              console.log(
                '选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片'
              )
            },
            fail: function (err) {
              console.log(err.errMsg)
            }
          }
        })
      },

      onloadImg() {
        if (this.urlImg && !this.flay) {
          uni.showLoading({
            title: '图片上传中'
          })
          this.flay = true

          let that = this
          uni.compressImage({
            src: that.urlImg,
            quality: 10,
            success: (resImg) => {
              console.log('tupian1', resImg)
              // 上传图片
              const uploadTask = uni.uploadFile({
                url: http.config.baseUrl + 'iclaim/user/photoUpload2', //仅为示例，非真实的接口地址
                filePath: resImg.tempFilePath,
                header: {
                  Authorization: `Bearer ${uni.getStorageSync('user')?.token}`
                },
                name: 'photo',
                success: async (uploadFileRes) => {
                  let res = JSON.parse(uploadFileRes.data)
                  console.log(res, '图片地址')
                  if (res.code == 200) {
                    let row = await that.$api.baoMinUpgrade({
                      photoUrl: res.data,
                      userId: that.user.id,
                      id: !!that.id ? that.id : null
                    })
                    if (row.code == 200) {
                      that.flay = false
                      uni.hideLoading()
                      uni.navigateTo({
                        url: '/pages/lpgs/processing'
                      })
                    } else {
                      that.flay = false
                      uni.hideLoading()
                      this.$toast('操作失败')
                    }
                  } else {
                    that.flay = false
                    uni.hideLoading()
                    this.$toast('上传失败')
                  }
                }
              })
            }
          })
        } else {
          this.$toast('请选择上传图片')
        }
      },
      // 选择图片
      loadImg() {
        console.log(111111)
        let that = this
        uni.chooseMedia({
          count: 1, //默认9
          sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
          success: function (res) {
            console.log(res.tempFiles[0].tempFilePath)
            that.urlImg = res.tempFiles[0].tempFilePath
            that.flay = false
          },
          fail: function (res) {
            console.log(res, '失败')
          }
        })
      },
      delImg() {
        this.urlImg = null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .boxuser {
    color: #999999;
    text-align: center;

    .title {
      font-size: 72rpx;
      color: #333333;
      margin-top: 80rpx;
      margin-bottom: 30rpx;
      font-family:
        PingFang SC-中黑体,
        PingFang SC;
    }

    .loadPhoto {
      width: 526rpx;
      height: 726rpx;
      margin: 0 auto;
      border-radius: 20rpx;
      margin-top: 80rpx;
      margin-bottom: 100rpx;
    }

    .loadImg {
      width: 526rpx;
      height: 726rpx;
      background-color: #f4f4f4;
      margin: 0 auto;
      border-radius: 20rpx;
      margin-top: 80rpx;
      margin-bottom: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .img_show {
        width: 138rpx;
        height: 112rpx;
      }
    }

    .boxX {
      width: 38px;
      height: 38px;
      background: rgba(0, 0, 0, 0.33);
      border-radius: 50%;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.08);
      position: absolute;
      left: 0;
      right: 0;
      bottom: 145rpx;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;

      .box_img {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .btnonImg {
      width: 580rpx;
      height: 88rpx;
      line-height: 88rpx;
      background-color: white;
      background-color: #cacaca;
      border-radius: 200rpx;
      margin: 0 auto;
      color: white;
      box-shadow: 0px 4px 10px 0px #cbcbcb;
    }

    .active {
      background: #3f9cff !important;
      box-shadow: 0px 4px 10px 0px rgba(63, 156, 255, 0.3) !important;
    }

    .imginfo {
      width: 526rpx;
      font-size: 28rpx;
      margin: 0 auto;
      margin-bottom: 30rpx;
    }
  }
</style>
