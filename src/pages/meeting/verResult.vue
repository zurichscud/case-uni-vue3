<template>
  <view class="main">
    <view class="result" :style="{ backgroundColor: bgcolor }">
      <image src="@/static/pay_success.png" mode="heightFix" v-if="result === '1'"></image>
      <image src="@/static/pay_error.png" mode="heightFix" v-else></image>
      <view>
        {{ text }}
      </view>
    </view>
    <view class="detail" v-if="result === '2' || result === '1'">
      <view class="title"> 门票信息: </view>
      <view class="item">
        <text class="label">票价：</text>
        <text class="content" style="font-weight: 700">{{ filterPrice(ticketInfo.style) }} 元</text>
      </view>
      <view class="item">
        <text class="label">活动名称：</text>
        <text class="content">第六届中国保险理赔峰会</text>
      </view>
      <view class="item">
        <text class="label">核销时间：</text>
        <text class="content">{{ ticketInfo.verifyTime }}</text>
      </view>
      <view class="item">
        <text class="label">购票时间：</text>
        <text class="content">{{ ticketInfo.createTime }}</text>
      </view>
      <view class="item">
        <text class="label">参会者：</text>
        <text class="content">{{ ticketInfo.name }}</text>
      </view>
      <view class="item" v-if="ticketInfo.orderId">
        <text class="label">订单号：</text>
        <text class="content">{{ ticketInfo.orderId }}</text>
      </view>
      <view class="item">
        <text class="label">票种：</text>
        <text class="content">保险营销员峰会门票</text>
      </view>
      <!-- <view class="item">
				日期：2024年11月24日（星期天）
			</view>
			<view class="item">
				时间：9:30 - 17:30
			</view> -->
      <!-- 			<view class="item">
				地点：成都市（具体地点待定）
			</view> -->
      <view class="item">
        <text class="label">票号：</text>
        <text class="content">{{ ticketInfo.ticketUuid }}</text>
      </view>
    </view>
    <button @click="goBack">← 返回核销页面</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        result: '',
        ticketsID: '',
        text: '',
        bgcolor: '',
        ticketInfo: {}
      }
    },
    onLoad(query) {
      // 0: 没有此票
      // 1: 核销成功
      // 2: 已被核销
      this.result = query.result
      this.ticketsID = query.ticketsID
      if (this.result === '1') {
        this.text = '门票有效，核销成功！'
        this.bgcolor = '#dcfce7'
        this.getTicketInfo()
      } else if (this.result === '2') {
        this.text = '门票已被核销'
        this.bgcolor = '#fe4e4e'
        this.getTicketInfo()
      } else {
        this.text = '门票无效'
        this.bgcolor = '#fe4e4e'
      }
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      goBack() {
        uni.navigateBack()
      },
      filterPrice(status) {
        if (status == 0 || status == 1) {
          return 588
        }
        if (status == 2) {
          return 400
        }
        return 588
      },
      async getTicketInfo() {
        const { data } = await this.$api.getTicket({
          ticketCode: this.ticketsID,
          userId: this.user.id
        })
        this.ticketInfo = data
      }
    }
  }
</script>

<style lang="scss">
  .main {
    padding: 20rpx;

    .result {
      height: 350rpx;
      border-radius: 20rpx;
      margin-bottom: 30rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      image {
        height: 100rpx;
        margin-bottom: 20rpx;
      }

      view {
        font-weight: 700;
        font-size: 42rpx;
      }
    }

    .detail {
      margin-bottom: 50rpx;

      .title {
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 10rpx;
      }

      .item {
        padding: 10rpx 0;
        display: flex;
        .label {
          width: 25%;
          text-align: left;
        }
        .content {
          width: 75%;
          word-wrap: break-word;
        }
      }
    }

    button {
      background-color: #fff;
      border: 1px solid #e4e4e7;
      border-radius: 20rpx;
    }
  }
</style>
