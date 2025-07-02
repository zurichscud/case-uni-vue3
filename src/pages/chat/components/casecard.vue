<template>
  <view>
    <view class="card_box">
      <view class="card_top flex_all">
        <view class="card_top_left">
          <image :src="item.photo" mode="" class="cardImg"></image>
          <view class="card_top_block">
            <view class="card_block_top">
              <text class="card_name">{{ item.nickName }}</text>
              <view class="card_statu">
                <view
                  class="timeStyle"
                  :class="[
                    item.remark == '6' ? 'remackBck' : '',
                    item.remark == '7' || item.remark == '8' ? 'remackBckV' : ''
                  ]">
                  {{ item.remark | getremark }}
                </view>
              </view>
            </view>
            <view class="card_case">
              案件编号<text>{{ item.caseId }}</text>
            </view>
          </view>
        </view>
        <view class="card_top_right" @click="navTo(item.caseId)" v-if="user.id == item.userId">
          进入聊天室 >
        </view>
      </view>

      <view class="card_main flex_all">
        <view class="">
          <view class="card_main_flex flex_start">
            <view class=""> 提交时间 </view>
            <view class="main_left">
              {{ item.caseSubmitTime }}
            </view>
          </view>
          <view class="card_main_flex flex_start">
            <view class=""> 办理进程 </view>
            <view class="main_left">
              {{ statuslist | diction(item.status) }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['user'])
    },
    props: ['item', 'remark', 'statuslist', 'swiperIndex'],
    mounted() {},
    methods: {
      navTo(caseId) {
        uni.navigateTo({
          url: `/pages/chat/chatroom?caseId=${caseId}`
        })
      }
    },
    filters: {
      getremark(val) {
        if (val == '5') {
          return '顾问'
        } else if (val == '8') {
          return '大队长·公社理事'
        } else if (val == '6') {
          return '社员'
        } else {
          return '大队长'
        }
      },

      diction(arr, v) {
        if (arr.length >= 1) {
          let data = arr.find((el, i) => {
            return el.dictValue == v
          })
          return data.dictLabel
        }
      },
      quest(arr, v) {
        if (arr.length >= 1) {
          let data = arr.find((el, i) => {
            return el.answerId == v
          })
          return data.msg
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .flex_all {
    display: flex;
    justify-content: space-between;
  }

  .flex_start {
    display: flex;
    justify-content: flex-start;
  }

  .card_box {
    box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.05);
    background: #ffffff;
    border-radius: 5px 5px 5px 5px;
    width: 618rpx;
    padding: 32rpx 44rpx;
    display: flow-root;
    margin: 20rpx auto;

    .card_top {
      padding-bottom: 24rpx;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 24rpx;

      .timeStyle {
        transform: scale(0.8);
        font-size: 24rpx;
        position: relative;
        left: 4rpx;
        background-image: linear-gradient(to right, #86bcff, #3f9cff);
        color: white;
        padding: 0 16rpx;
        height: 42rpx;
        line-height: 42rpx;
        text-align: center;
        border-radius: 50rpx;
      }

      .remackBck {
        background-image: linear-gradient(to right, #3f9cff, #0051e3);
      }

      .remackBckV {
        background: linear-gradient(133deg, #ffd37e 0%, #ff9500 99%);
      }

      .card_top_right {
        width: 200rpx;
        height: 64rpx;
        line-height: 64rpx;
        border-radius: 200rpx;
        font-size: 24rpx;
        text-align: center;
        color: white;
        box-shadow: 0px 2px 7px 0px rgba(0, 115, 238, 0.27);
        background: linear-gradient(139deg, #6bb3ff 0%, #1486ff 100%);
      }

      .card_top_left {
        display: flex;
        justify-content: flex-start;

        .cardImg {
          width: 88rpx;
          height: 88rpx;
          margin-right: 10rpx;
          border-radius: 50%;
        }

        .card_top_block {
          .card_block_top {
            display: flex;
            justify-content: flex-start;

            .card_name {
              font-size: 36rpx;
              margin-top: -2px;
              display: flow-root;
              max-width: 200rpx;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }

          .card_case {
            color: #666666;
            font-size: 24rpx;
            margin-top: 6rpx;
          }
        }
      }
    }

    .card_main {
      font-size: 24rpx;
      line-height: 44rpx;

      .card_main_flex {
        color: #999999;
      }

      .card_event {
        display: flex;
        align-items: center;
        white-space: nowrap;
        color: #3f9cff;
      }

      .main_left {
        margin-left: 54rpx;
        color: #000000;
      }
    }

    .card_main_pay {
      font-size: 24rpx;
      color: #999999;

      .main_left {
        margin-left: 54rpx;
        color: #000000;
      }
    }

    .card_meeting {
      padding-top: 24rpx;
      border-top: 1px solid #f0f0f0;
      margin-top: 24rpx;
      font-size: 24rpx;
      color: #000000;

      .text_nowarp {
        width: 480rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .card_detail {
        color: #3f9cff;
      }

      .copy {
        width: 20rpx;
        height: 24rpx;
      }
    }
  }
</style>
