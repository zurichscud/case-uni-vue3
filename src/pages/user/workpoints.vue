<!-- 我的工分 -->
<template>
  <view style="padding: 24rpx">
    <view class="top_box" style="position: relative">
      <view class="guize" @click="guiUp">
        <image src="../../static/img50.png" mode="" class="guizeImg"></image>
      </view>
      <view class="top_text"> 当前工分 </view>
      <view class="num_text">
        {{ dataList.points }}
      </view>
      <view class="btm_flex">
        <view class="btm_text"> 累计工分 </view>
        <view class="btm_text">
          {{ dataList.use_points }}
        </view>
      </view>
    </view>
    <view class="btm_box">
      <view class="swiper_top_text">
        <view
          class=""
          @click="setIndex(item.value, item.index)"
          style="position: relative"
          v-for="(item, index) in listText"
          :key="index"
          :class="swiperIndex == index ? 'active' : ''"
        >
          {{ item.title }}
          <view class="hr_active" v-if="item.index == swiperIndex"> </view>
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
              <view class="scroll_view" v-for="item in dataList.myPointsLists" :key="item.id">
                <view class="scroll_left">
                  <view class="scroll_title">
                    <text>{{ item.addName }}</text>
                  </view>
                  <view class="scroll_time">
                    {{ item.createTime }}
                  </view>
                </view>
                <view class="scroll_right">
                  {{ item.points }}
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
  import alert from '@/components/alert.vue'
  export default {
    data() {
      return {
        swiperIndex: 0,
        listText: [],
        isAdd: 0,
        pointsIds: null,
        dataList: {
          myPointsLists: [],
          use_points: 0,
          points: 0
        }
      }
    },
    components: {
      alert
    },
    computed: {
      ...mapState(['user'])
    },
    onLoad() {
      this.listText =
        this.user.remark == '5'
          ? [
              { title: '全部', value: [0], index: 0 },
              { title: '提交案件', value: [3], index: 1 },
              { title: '消耗工分', value: [4], index: 2 }
            ]
          : [
              { title: '全部', value: [0], index: 0 },
              { title: '邀请社员', value: [1], index: 1 },
              { title: '邀请顾问', value: [2], index: 2 },
              { title: '提交案件', value: [3, 6], index: 3 },
              { title: '消耗工分', value: [4], index: 4 }
            ]
      this.feachList()
    },
    methods: {
      guiUp() {
        uni.downloadFile({
          url: 'https://app.y9net.cn/data/01/38/wKgBNmPmBl2AC_V6AALrY5XGWvI771.pdf',
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
      async setIndex(i, index) {
        this.swiperIndex = index
        if (i[0] == 4) {
          this.isAdd = 1
          this.pointsIds = null
        } else {
          this.pointsIds = i[0] == 0 ? null : i
          this.isAdd = 0
        }
        await this.feachList()
      },
      async feachList() {
        let res = await this.$api.getMyPoints({
          isAdd: this.isAdd,
          pointsIds: this.pointsIds,
          userId: this.user.id
        })
        this.dataList = res.data
      }
    }
  }
</script>

<style scoped lang="scss">
  .top_box {
    background: #ffffff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;
    padding: 44rpx 42rpx;
    .num_text {
      text-align: center;
      font-size: 72rpx;
      color: #111111;
      margin: 40rpx 0;
    }
    .top_text {
      text-align: center;
      font-size: 24rpx;
      color: #3d3d3d;
    }
    .btm_flex {
      display: flex;
      justify-content: space-between;
      .btm_text {
        color: #3d3d3d;
        font-size: 28rpx;
      }
    }
  }
  .wapper {
    width: 630rpx;
    text-align: left;
    color: #b6b6b6;
    font-size: 24rpx;
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
    .scroll_time {
      margin-top: 10rpx;
      margin-bottom: 20rpx;
      color: #999999;
      font-size: 24rpx;
    }
    .scroll_title {
      color: #3d3d3d;
      font-size: 28rpx;
    }
  }
  .swiper-item {
    height: 100%;
  }
  .btm_box {
    padding: 30rpx;
    margin-top: 30rpx;
    background: #ffffff;
    box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
    border-radius: 30rpx;
    height: 65vh;
    .swiper_top_text {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #999999;
      .active {
        color: #3f9cff;
        font-size: 28rpx;
      }
    }
    .position_swiper {
      // margin-top: 30rpx;
      height: 60vh;
    }

    .hr_active {
      height: 4rpx;
      width: 40rpx;
      background-color: #3f9cff;
      margin: 10rpx auto;
    }
  }
  .guize {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    right: 40rpx;
    top: 40rpx;
    .guizeImg {
      width: 40rpx;
      height: 40rpx;
    }
  }
  .alertC {
    width: 560rpx;
    padding: 0 30rpx 30rpx 30rpx;
    .content {
      text-align: left;
      font-size: 30rpx;
    }

    .title {
      font-size: 36rpx;
      color: $uni-text-color-inverse;
      margin-top: 20rpx;
    }
    .con {
      padding: 20rpx 0 0rpx 0;
      font-size: 28rpx;
      width: 560rpx;
    }
    .title1 {
      font-weight: bold;
      margin-top: 40rpx;
      margin-bottom: 8rpx;
    }
    .title1:first-child {
      margin-top: 0rpx !important;
    }
  }
</style>
