<template>
  <view style="padding: 24rpx">
    <view class="top_box">
      <view class="box_show" @click="nav('inviteList')">
        <image class="images_title" src="../../static/img40.png" mode=""></image>
        <text class="text_title">团队人数</text
        ><text class="titleIndex">{{ datataem.myTeamCount }}</text>
      </view>
    </view>
    <view class="btm_list btm_box">
      <view class="swiper_top_text">
        <view
          class=""
          @click="setIndex(index)"
          style="position: relative"
          v-for="(item, index) in listText"
          :key="index"
          :class="index == swiperIndex ? 'active' : ''"
        >
          {{ item }}
          <view class="hr_active" v-if="index == swiperIndex"> </view>
        </view>
      </view>
      <swiper
        :interval="3000"
        :duration="0"
        class="position_swiper"
        :current="swiperIndex"
        circular="false"
      >
        <swiper-item @touchmove.stop="" v-for="(item, index) in listText" :key="index">
          <view class="swiper-item">
            <scroll-view scroll-y="true" style="height: 100%">
              <view class="content" v-for="(item, index) in dataList" :key="index">
                <view class="li">
                  <view class="">
                    <image
                      :src="item.photo"
                      mode=""
                      style="
                        width: 92rpx;
                        height: 92rpx;
                        margin-top: 10rpx;
                        vertical-align: middle;
                        border-radius: 50%;
                      "
                    >
                    </image>
                  </view>
                  <view class="" style="margin-left: 20rpx">
                    <view class="top">
                      <text style="display: inline-block; margin-top: 12rpx">{{
                        item.nickName
                      }}</text>
                    </view>
                    <view class="bottom">
                      <text>案件数量：{{ item.totalCases }}件</text>
                      <text>{{ item.gmtCreate }}</text>
                    </view>
                  </view>
                  <view
                    class="timeStyle"
                    :class="[
                      item.remark == '6' ? 'remackBck' : '',
                      item.remark == '7' || item.remark == '8' ? 'remackBckV' : ''
                    ]"
                  >
                    {{ item.remark | getremark }}
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        datataem: {
          myTeamUser: [],
          myTeamCount: 0,
          myCaseCount: 0
        },
        dataList: [],
        swiperIndex: 0,
        listText: ['团队成员', '已晋升的成员']
      }
    },
    computed: {
      ...mapState(['user'])
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
      }
    },
    onLoad() {
      this.feachList()
    },
    methods: {
      async setIndex(i) {
        this.swiperIndex = i
        if (i == 0) {
          this.dataList = this.datataem.myTeamUser
        } else {
          this.dataList = this.datataem.myTeamUpgradeUser
        }
      },
      nav(name) {
        uni.navigateTo({
          url: `/pages/invite/record`
        })
      },
      async feachList() {
        let res = await this.$api.getMyTeam({
          userId: this.user.id
        })
        if (res.code == 200) {
          this.datataem = res.data
          this.dataList = res.data.myTeamUser
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .top_box {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
  }

  .btm_list {
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;
    padding: 10rpx 0 20rpx 0;
    margin-top: 44rpx;
  }

  .box_show {
    width: 100%;
    height: 122rpx;
    background-color: #ffffff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;
    font-size: 28rpx;
    line-height: 122rpx;
    text-align: center;

    .images_title {
      width: 56rpx;
      height: 46rpx;
      vertical-align: middle;
      margin-top: -5rpx;
    }

    .text_title {
      margin: 0 10rpx;
      color: #111111;
      font-size: 28rpx;
    }

    .titleIndex {
      color: #111111;
      font-size: 48rpx;
      display: inline-block;
      margin-top: -10rpx;
      vertical-align: middle;
    }
  }

  .content {
    margin-top: 16rpx;
    background: #fff;
    color: #505050;
    border-bottom: 1px solid #eeeeee;

    .li {
      padding: 24rpx 0;
      display: flex;
      width: 100%;
      position: relative;
    }

    .li:last-child {
      border: none !important;
    }

    .bottom {
      margin-top: 20rpx;
      display: flex;
      justify-content: space-between;
      width: 526rpx;
    }

    // .bottom text:first-child{margin-right: 56rpx;}
    .top {
      font-size: 28rpx;
      color: black;
    }

    .bottom {
      font-size: 24rpx;
      color: #848484;
    }
  }

  .timeStyle {
    font-size: 24rpx;
    position: absolute;
    top: 29rpx;
    right: 0rpx;
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

  .btm_flex {
    display: flex;
    justify-content: space-between;

    .btm_text {
      color: #3d3d3d;
      font-size: 28rpx;
    }
  }

  .btm_box {
    padding: 30rpx;
    margin-top: 30rpx;
    background: #ffffff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;
    height: 80vh;

    .swiper_top_text {
      display: flex;
      justify-content: space-around;
      font-size: 24rpx;
      color: #999999;

      .active {
        color: #3f9cff;
        font-size: 28rpx;
      }
    }

    .position_swiper {
      height: 75vh;
    }

    .hr_active {
      height: 4rpx;
      width: 40rpx;
      background-color: #3f9cff;
      margin: 10rpx auto;
    }
  }

  .scroll_view {
    margin-top: 20rpx;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;

    .scroll_right {
      font-size: 36rpx;
      color: #3f9cff;
      margin-top: 12rpx;
    }
  }
  .swiper-item {
    height: 100%;
  }
</style>
