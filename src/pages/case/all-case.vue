<template>
  <view class="">
    <view class="swiper_top_text" v-if="!!user && user.remark != '5'">
      <view
        class=""
        @click="setIndex(index)"
        style="position: relative"
        v-for="(item, index) in listText"
        :key="index"
        :class="index == swiperIndex ? 'active' : ''"
      >
        <view class="text">
          {{ item }}
        </view>
        <view class="hr_active" v-if="index == swiperIndex">
          <image src="../../static/active.png" mode="" class="active_btm_icon"></image>
        </view>
      </view>
    </view>
    <view v-if="!user" class="">
      <none btn="请登录账号后查看~"></none>
    </view>
    <view v-else>
      <view v-if="!!user && list.length == 0" class="">
        <none name="暂无案件~"></none>
      </view>
      <view v-if="!!user && list.length != 0" class="swiper-item">
        <view class="case">
          <scroll-view
            scroll-y="true"
            :scroll-top="scrollTop"
            :style="{
              height: user.remark == '5' ? '100vh' : '92vh',
            }"
            class="scrollHeight"
          >
            <view class="" style="padding-bottom: 100rpx">
              <view class="list" v-for="(item, i) in list" :key="i">
                <casecard
                  @submit="open"
                  :item="item"
                  :swiperIndex="swiperIndex"
                  :remark="user.remark"
                  :statuslist="statuslist"
                ></casecard>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="btn_before">
        <view type="primary" class="text-u-d" @click="navTo">查看往期提交的案件>></view>
      </view>
    </view>
  </view>
</template>

<script>
import casecard from './components/casecard.vue'
import * as MessageAPI from '@/apis/message'

export default {
  components: {
    casecard,
  },
  data() {
    return {
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
      listText: [],
      swiperIndex: 0,
      parogress: [],
      list: [],
      remark: '',
      currentTimeL: [],
      statuslist: [],
    }
  },
  filters: {
    getremark(val) {
      if (val == '7') {
        return '大队长'
      } else if (val == '8') {
        return '大队长·公社理事'
      } else if (val == '6') {
        return '社员'
      } else {
        return '顾问'
      }
    },
    diction(arr, v) {
      let data = arr.find((el, i) => {
        return el.answerId == v
      })
      return data.msg
    },
    quest(arr, v) {
      let data = arr.find((el, i) => {
        return el.status == v
      })
      return data.dictLabel
    },
  },
  computed: {
    ...mapState(['user']),
  },
  onShow() {
    if (!!this.user) {
      if (this.user.remark == 6) {
        this.listText = ['全部', '我提交的', '我客户提交的']
      } else {
        this.listText = ['全部', '我提交的', '我客户提交的', '社员及其客户']
      }
      this.filters()
      this.fetchList(this.swiperIndex)
    } else {
    }
  },
  onLoad() {
    //isInvite
  },
  onReachBottom() {
    console.log('我到达底部了!!!')
  },

  methods: {
    navTo() {
      uni.navigateTo({
        url: '/pages/case/case',
      })
    },
    goTop: function (e) {
      // 解决view层不同步的问题
      console.log(this.scrollTop, '前')
      this.scrollTop = this.old.scrollTop
      this.$nextTick(function () {
        this.scrollTop = 0.01
      })
      console.log(this.scrollTop, '后')
    },

    async setIndex(i) {
      this.swiperIndex = i
      this.fetchList(i)
      this.goTop()
    },
    async filters() {
      let row = await this.$api.getSysDictData({
        dictType: 'new_case_status_end',
      })
      this.statuslist = row.rows
    },
    async fetchList(type) {
      let res = await this.$api.newGetCaseInfo({
        type,
        userId: this.user.id,
      })
      this.list = res.data
    },
    async getusersList() {
      let { datas } = await MessageAPI.getUnReadMessage({
        userId: this.user.id,
      })
      this.$store.commit('getLists', datas)
      let textIndex = datas.count.caseStatusCount + datas.count.interactCount + datas.count.sysCount
      if (textIndex == 0) {
        uni.removeTabBarBadge({
          index: 2,
        })
      } else {
        uni.setTabBarBadge({
          index: 2,
          text: textIndex + '',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$btnHeight: 80rpx;

.swiper-item {
  background-color: #f9f9f9;
}

.swiper_top_text {
  padding-top: 28rpx;
  display: flex;
  justify-content: space-around;
  font-size: 28rpx;
  color: #999999;
  background-color: white;

  .active {
    color: #000000;
    font-size: 36rpx;

    .text {
      position: relative;
      top: -8rpx;
    }
  }
}

.hr_active {
  // margin: 10rpx auto;
  font-size: 10rpx;
  text-align: center;
  margin-bottom: 16rpx;

  .active_btm_icon {
    height: 6rpx;
    width: 28rpx;
  }
}

.wapper {
  width: 630rpx;
  text-align: left;
  color: #b6b6b6;
  font-size: 24rpx;

  .item {
    padding: 16rpx;
  }

  .left {
    position: relative;
    width: 20rpx;

    .circular {
      width: 16rpx;
      height: 16rpx;
      background: $uni-text-color-inverse;
      border-radius: 50%;
      position: absolute;
      top: 10rpx;
    }

    .topBorder {
      height: 50rpx;
      width: 2rpx;
      border-left: 2rpx solid #3f9cff;
      position: absolute;
      left: 35%;
      top: 10rpx;
    }

    .bottomBorder {
      height: 50rpx;
      width: 2rpx;
      border-left: 2rpx solid #3f9cff;
      position: absolute;
      left: 35%;
      bottom: -12rpx;
    }
  }

  .center {
    color: $uni-text-color-inverse;
  }
}

.case {
  .li:first-child {
    margin-top: 10rpx;
  }

  .li {
    background: white;
    padding: 24rpx 0;
    margin-bottom: 30rpx;
    border-radius: 30rpx;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
  }

  // .top text:last-child{color: #B6B6B6;font-size: 24rpx;}
  .bottom text:first-child {
    color: #b6b6b6;
    font-size: 24rpx;
  }

  .bottom text:last-child {
    color: $uni-text-color-inverse;
    font-size: 24rpx;
  }

  .case_remark {
    // width: 66rpx;
    padding: 0 10rpx;
    height: 32rpx;
    background-image: linear-gradient(to right, #86bcff, #3f9cff);
    border-radius: 50rpx;
    font-size: 20rpx;
    text-align: center;
    color: white;
    display: inline-block;
    line-height: 32rpx;
    margin-top: -10rpx;
    margin-left: 10rpx;
    vertical-align: middle;
  }

  .remackBck {
    background-image: linear-gradient(to right, #3f9cff, #0051e3);
  }

  .remackBckV {
    background: linear-gradient(133deg, #ffd37e 0%, #ff9500 99%);
  }

  .time_axis {
    width: 700rpx;
    height: 140rpx;
    padding: 58rpx;

    .time_hr {
      width: 100%;
      height: 2rpx;
      background-color: #c0c0c0;
      position: relative;
      display: flex;
      margin: 0 auto;

      .t_li {
        position: absolute;
        top: 0;

        .t_yuan {
          width: 24rpx;
          height: 24rpx;
          border-radius: 100%;
          background-color: $uni-text-color-inverse;
          position: absolute;
          top: -12rpx;
          left: -12rpx;
          z-index: 66;
        }

        .t_y1 {
          width: 36rpx;
          height: 36rpx;
          border: 2px solid $uni-text-color-inverse;
          position: absolute;
          top: -22rpx;
          border-radius: 100%;
          left: -22rpx;
          background-color: #ffffff;
          z-index: 65;
        }

        .t_hr {
          height: 2rpx;
          background-color: $uni-text-color-inverse;
          position: absolute;
          top: 0;
          left: 12rpx;
        }

        .txt {
          position: absolute;
          color: #999999;
          top: 26rpx;
          height: 34rpx;
          line-height: 34rpx;
          min-width: 72rpx;
          max-width: 96rpx;
          font-size: 24rpx;
          left: 50%;
          transform: translateX(-50%);
        }

        .ty_x2 {
          background-color: #c0c0c0 !important;
        }
      }
    }
  }
}

.blue {
  background-color: #d8d8d8 !important;
}

.btn_before {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $btnHeight;
  line-height: $btnHeight;
  text-align: right;
  padding: 0 44rpx;
  box-sizing: border-box;
  background-color: white;
}
</style>
