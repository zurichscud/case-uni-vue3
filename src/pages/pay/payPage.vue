<template>
  <view>
    <view class="main_top">
      <view class="main_top_top">
        {{ status.remark }}
      </view>
      <view class="main_top_main"> ￥{{ status.dictLabel }}.00 </view>
      <view class=""> 等待支付 </view>
    </view>
    <view class="main">
      <view class="">
        <image src="../../static/wx_pay_icon.png" mode="" class="wxicon"></image>
        <text style="margin-left: 10rpx">微信支付</text>
      </view>
      <view class="">
        <image src="../../static/succ_pay.png" mode="" class="wxicon"></image>
      </view>
    </view>
    <view class="fixed_bottom" @click="addCode"> 确认支付 </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        options: {},
        status: {
          remark: '暂无',
          dictLabel: 0
        },
        flay: false,
        caseIdBool: true
      }
    },
    async onLoad(options) {
      this.options = options
      if (!!!this.options?.caseId) {
        this.caseIdBool = false
      }
      await this.payNum()
    },
    filters: {
      payItem(val, arr, type) {
        let item = arr.find((el, i) => {
          return el.awser2 == val
        })
        if (type == 'value') {
          return item?.value
        } else {
          return item?.payNum
        }
      }
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      async payNum() {
        let res = await this.$api.getDictData({
          dictType: 'lpgs_service',
          dictValue: this.options?.type
        })
        if (res.code == 200) {
          this.status = res.data.dictLabel
          if (this.options.type == 8) {
            this.status.dictLabel = this.options.money
          }
        } else {
          this.$toast('请求错误')
        }
      },
      async addCode() {
        if (!this.flay) {
          this.flay = true
          setTimeout(() => {
            this.flay = false
          }, 2000)
          let e = await uni.login({})
          let data = {
            code: e[1].code
          }
          let { datas } = await this.$api.getSessionKey(data)
          let openid = datas.openid
          let dataObj
          if (this.caseIdBool) {
            dataObj = {
              openId: datas.openid,
              type: this.options.type,
              bussinessType: this.options.bussinessType,
              userId: this.user.id,
              caseId: this.options.caseId,
              returnUrl: 'https://iclaim-sales.y9net.cn/#/pagesA/focusBook/payStatu'
            }
          } else {
            const commissionAgentId = uni.getStorageSync('commissionAgentId')
            if (!!commissionAgentId) {
              dataObj = {
                openId: datas.openid,
                type: this.options.type,
                bussinessType: this.options.bussinessType,
                userId: this.user.id,
                returnUrl: 'https://iclaim-sales.y9net.cn/#/pagesA/focusBook/payStatu',
                commissionAgentId
              }
            } else {
              dataObj = {
                openId: datas.openid,
                type: this.options.type,
                bussinessType: this.options.bussinessType,
                userId: this.user.id,
                returnUrl: 'https://iclaim-sales.y9net.cn/#/pagesA/focusBook/payStatu'
              }
            }
            if (!!this.options?.cardChapter) {
              dataObj.cardChapter = this.options.cardChapter
            }
          }

          let resObj = await this.$api.lpgsOrderPayment(dataObj)
          let pay = await this.uppaywechat(resObj.data)
        }
      },
      // 提交聊天记录
      async addMsg(msg) {
        let res = await this.$api.addMsgOrder(msg)
        if (res.code == 200) {
          return true
        }
      },
      //拉起微信支付
      uppaywechat(main) {
        console.log(main, '-------')
        let msg = {
          type: 3,
          userId: this.user.id,
          caseId: this.options.caseId ? this.options.caseId : null,
          messageType: 1
        }
        let that = this
        uni.requestPayment({
          provider: 'wxpay',
          appId: main.appId,
          timeStamp: main.timeStamp,
          nonceStr: main.nonceStr,
          signType: main.signType,
          paySign: main.paySign,
          package: main.prepayId,
          success: async function (res) {
            console.log(res, '支付成功')
            if (res.errMsg == 'requestPayment:ok') {
              //支付成功
              if (that.caseIdBool) {
                msg.msg = '支付成功，专家将在2小时内与您联系！'
                await that.addMsg(msg)
                msg.messageType = 5
                msg.msg = `<div style='font-size:12px;width: 100%;white-space: nowrap;color: #c5c5c5;margin: 20px 0;'><span style='color:#999;'>———————</span><span style='margin:0 20px;'>专家正在赶来的路上~</span><span style='color:#999;'>———————</span></div>`
                await that.addMsg(msg)
                let payNum = that.payNum()
                console.log(that.options?.caseId, '支付页面')
                uni.reLaunch({
                  url: `/pages/pay/payResults?payNum=${that.status.dictLabel}&caseId=${that.options.caseId}`
                })
              } else {
                // that.$userLogin()
                uni.reLaunch({
                  url: `/pages/pay/payResults?payNum=${that.status.dictLabel}`
                })
              }
            } else {
              //支付失败
              console.log('支付失败')
            }
          },
          fail: function (res) {
            console.log('调用失败')
            uni.reLaunch({
              url: '/pages/pay/payResults'
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .main_top {
    margin: 32rpx 32rpx;
    width: 686rpx;
    height: 284rpx;
    text-align: center;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 20rpx;
    color: #666666;
    font-size: 28rpx;
    border: 1px solid transparent;

    .main_top_top {
      margin-top: 50rpx;
    }

    .main_top_main {
      font-size: 72rpx;
      color: #111111;
      margin: 10rpx 0;
    }
  }

  .main {
    margin: 32rpx 32rpx;
    width: 686rpx;
    height: 124rpx;
    background: #ffffff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 20rpx;
    padding: 0 32rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    line-height: 124rpx;
    font-size: 36rpx;

    .wxicon {
      width: 48rpx;
      height: 48rpx;
      vertical-align: middle;
      position: relative;
      top: -5rpx;
    }
  }

  .fixed_bottom {
    margin: 32rpx 32rpx;
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
