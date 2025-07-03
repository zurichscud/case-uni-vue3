<template>
  <view class="box_page">
    <view class="page_padding">
      <view class="">
        <image class="imgStyle" src="/src/static/back.png" mode="" @click="navback"></image>
      </view>
      <view class="" style="padding: 40rpx 20rpx">
        <view class="">
          <view class="colorWhite">
            <image class="img_icon" src="/src/static/computer.png" mode=""></image>
            会议邀请
          </view>
        </view>
        <view class="colorWhite statu">
          {{ dataObj.meetingStatus | statusfilter }}
        </view>
      </view>
      <view class="card">
        <view class="card_padding">
          <view class="card_top">
            <image :src="dataObj.expertPhoto" class="cardImage" mode=""></image>
            <view class="card_top_right">
              <view class="card_top_right_caseId">案件编号{{ dataObj.caseId }}</view>
              <view class="card_top_right_expersId">
                {{ dataObj.expertName }}
              </view>
            </view>
          </view>
          <view class="hr_division"></view>
          <view class="detailed_info">
            <view class="detailed_info_left">时间</view>
            <view class="detailed_info_right">
              {{ dataObj.startTime | time }}
            </view>
          </view>
          <view class="detailed_info">
            <view class="detailed_info_left">联系人</view>
            <view class="detailed_info_right">
              {{ dataObj.expertName }} {{ dataObj.expertPhone }}
            </view>
          </view>
          <view class="detailed_info">
            <view class="detailed_info_left">方式</view>
            <view class="detailed_info_right">
              <view class="detailed_info_right_title">
                <text>腾讯会议</text>
                <image
                  @click="copyBtn"
                  class="detailed_info_right_title_img"
                  src="/src/static/Vector.png"
                  mode=""
                ></image>
              </view>
              <view class="detailed_info_right_title">
                {{ dataObj.meetingUrl }}
              </view>
              <view class="detailed_info_right_title">
                会议号：
                <text user-select>{{ dataObj.meetingId }}</text>
              </view>
            </view>
          </view>
          <view class="detailed_info">
            <view class="detailed_info_left">备注</view>
            <view class="detailed_info_right_title dishidden">
              {{ dataObj.remark }}
            </view>
          </view>
        </view>
      </view>
      <view class="operation" v-if="dataObj.meetingStatus == 1">
        <view class="operation_refuse publicBtn" @click="updateStatus(4)">拒绝</view>
        <view class="operation_accept publicBtn" @click="updateStatus(2)">接受</view>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      dataObj: {},
      options: {},
    }
  },
  filters: {
    time(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    },
    statusfilter(val) {
      if (val == 1) {
        return '待接受'
      } else if (val == 2) {
        return '已接受'
      } else if (val == 3) {
        return '已完成'
      } else if (val == 4) {
        return '已拒绝'
      } else if (val == 5) {
        return '爽约'
      }
    },
  },
  computed: {
    ...mapState(['user']),
  },
  onLoad(options) {
    this.options = options
    this.fetchList(options.id)
  },
  methods: {
    async updateStatus(status) {
      let res = await this.$api.updateMeetingStatus({
        meetingId: this.options.id,
        meetingStatus: status,
        userId: this.user.id,
      })
      await this.fetchList(this.options.id)
    },
    async fetchList(id) {
      let res = await this.$api.getMeetingById({ meetingId: id })
      if (res.code == 200) {
        this.dataObj = res.data
      }
    },
    copyBtn() {
      let that = this
      console.log('执行')
      uni.setClipboardData({
        data: this.dataObj.context,
        success: function () {
          console.log('success')
          that.$toast('复制成功')
        },
        fail(err) {
          console.log(err, '执行2')
        },
      })
    },
    navback() {
      uni.navigateBack({
        delta: 1,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.box_page {
  height: 99vh;
  background: linear-gradient(180deg, #3f9cff 0%, rgba(216, 216, 216, 0) 69%);

  .page_padding {
    padding: 0 32rpx;

    .operation {
      display: flex;
      justify-content: space-between;
      position: fixed;
      bottom: 40rpx;
      width: 686rpx;
      .publicBtn {
        width: 314rpx;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 10rpx;
      }

      .operation_refuse {
        background-color: #ececec;
        color: #686868;
      }

      .operation_accept {
        background: linear-gradient(135deg, #8dc4ff 0%, #3f9cff 100%);
        color: white;
      }
    }
  }

  .card_padding {
    padding: 32rpx;

    .detailed_info {
      display: flex;
      justify-content: start;
      margin: 40rpx 0;

      .detailed_info_left {
        width: 100rpx;
        font-size: 28rpx;
        color: #ababab;
      }

      .detailed_info_right {
        .detailed_info_right_title {
          margin-bottom: 10rpx;
          width: 486rpx;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          .detailed_info_right_title_img {
            width: 25rpx;
            height: 30rpx;
            vertical-align: middle;
            position: relative;
            top: -2rpx;
            margin-left: 6rpx;
          }
        }
        .dishidden {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }

    .card_top {
      display: flex;
      justify-content: start;

      .cardImage {
        border-radius: 14rpx;
        width: 102rpx;
        height: 102rpx;
      }
    }

    .card_top_right {
      margin-left: 20rpx;

      .card_top_right_expersId {
        font-size: 28rpx;
        margin-top: 10rpx;
      }

      .card_top_right_caseId {
        margin-top: 5rpx;
        font-size: 36rpx;
      }
    }

    .hr_division {
      width: 100%;
      height: 1px;
      background-color: #d8d8d8;
      margin: 20rpx 0;
    }
  }

  .colorWhite {
    color: white;
  }

  .statu {
    margin-top: 20rpx;
    font-size: 36rpx;
  }

  .img_icon {
    width: 40rpx;
    height: 40rpx;
    vertical-align: middle;
    position: relative;
    top: -5rpx;
    margin-right: 10rpx;
  }

  .card {
    height: 684rpx;
    background-color: white;
    border-radius: 30rpx;
  }

  .imgStyle {
    width: 50rpx;
    height: 50rpx;
    margin-top: 100rpx;
  }
}
</style>
