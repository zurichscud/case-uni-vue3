<template>
  <view v-if="!user" class="">
    <none btn="请登录账号后查看~"></none>
  </view>
  <view v-else class="">
    <view class="flex_box" @click="navTo('caseSpeed')">
      <view class="viewImage">
        <image src="../../static/img8.png" mode="" class="images"></image>
      </view>
      <view class="viewText">
        <view class="flex_alls">
          <view class="newsTitle"> 案件进度通知 </view>
          <view class="newsTime" style="margin-right: 32rpx">
            <text v-if="!!datas.count.caseStatusCount != 0">
              {{ 1 | time }}
            </text>
          </view>
        </view>
        <view class="Tips">
          <view class="TipsText">
            {{ 1 | textContent }}
          </view>
          <view class="textIndex" v-if="!!datas.count.caseStatusCount != 0">
            {{ datas.count.caseStatusCount }}
          </view>
        </view>
      </view>
    </view>
    <view class="flex_box" @click="navTo('interaction')">
      <view class="viewImage">
        <image src="../../static/img9.png" mode="" class="images"></image>
      </view>
      <view class="viewText">
        <view class="flex_alls">
          <view class="newsTitle"> 互动消息 </view>
          <view class="newsTime" style="margin-right: 32rpx">
            <text v-if="!!datas.count.interactCount != 0">
              {{ 2 | time }}
            </text>
          </view>
        </view>
        <view class="Tips">
          <view class="">
            <view class="TipsText">
              {{ 2 | textContent }}
            </view>
          </view>
          <view class="textIndex" v-if="!!datas.count.interactCount != 0">
            {{ datas.count.interactCount }}
          </view>
        </view>
      </view>
    </view>
    <view class="flex_box" @click="navTo('system')">
      <view class="viewImage">
        <image src="../../static/img49.png" mode="" class="images"></image>
      </view>
      <view class="viewText">
        <view class="flex_alls">
          <view class="newsTitle"> 系统消息 </view>
          <view class="newsTime" style="margin-right: 32rpx">
            <text v-if="!!datas.count.sysCount != 0">
              {{ 0 | time }}
            </text>
          </view>
        </view>
        <view class="Tips">
          <view class="">
            <view class="TipsText">
              {{ 0 | textContent }}
            </view>
          </view>

          <view class="textIndex" v-if="!!datas.count.sysCount != 0">
            {{ datas.count.sysCount }}
          </view>
        </view>
      </view>
    </view>

    <view class="text"> · 没有更多消息了 · </view>
  </view>
</template>

<script>
  import dayjs from 'dayjs'
  import { mapState, mapMutations } from 'vuex'
  import * as MessageAPI from '@/apis/message'

  let that
  export default {
    data() {
      return {}
    },
    beforeCreate() {
      that = this
    },
    onLoad() {},
    filters: {
      // 案件进度1专家2
      textContent(index) {
        // console.log(that);
        let dataIndex = that.datas.caseMessage.findIndex((el, i) => {
          return el.category == index
        })
        return that.datas.caseMessage[dataIndex].content
      },
      textFilter(v) {
        if (v) {
          return v
        } else {
          return ''
        }
      },
      time(indexPage) {
        let dataIndex = that.datas.caseMessage.findIndex((el, i) => {
          return el.category == indexPage
        })
        let time = that.datas.caseMessage[dataIndex].gmtCreate

        //获取今天的零点时间戳
        let todayTimer = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
        //这个也可以获取零点的时间
        // let todayTimer=new Date(new Date().toLocaleDateString()).getTime()/1000;
        //获取昨天零点的时间戳
        let yesterdayTimer = todayTimer - 3600 * 24
        //获取今天的日期字符串
        let todayData = dayjs().format('YYYY-MM-DD')
        let timer = dayjs(time).unix()
        // console.log(new Date(timer * 1000).toLocaleDateString(),todayData);
        if (dayjs(time).format('YYYY-MM-DD') === todayData) {
          return '今天'
        } else if (timer < todayTimer && timer >= yesterdayTimer) {
          return '昨天'
        } else if (time) {
          return dayjs(time).format('YYYY-MM-DD')
        } else {
          return ''
        }
      }
    },
    onShow() {
      if (!this.user) return
      this.getusersList()
    },
    computed: { ...mapState(['user', 'datas']) },
    methods: {
      async getusersList() {
        let { datas } = await MessageAPI.getUnReadMessage({
          userId: this.user.id
        })
        this.$store.commit('getLists', datas)
        let textIndex =
          datas.count.caseStatusCount + datas.count.interactCount + datas.count.sysCount
        if (textIndex == 0) {
          uni.removeTabBarBadge({
            index: 2
          })
        } else {
          uni.setTabBarBadge({
            index: 2,
            text: String(textIndex)
          })
        }
      },
      navTo(name) {
        uni.navigateTo({
          url: `/pages/message/${name}`
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .text {
    text-align: center;
    color: #999;
    font-size: 26rpx;
    height: 40rpx;
    line-height: 40rpx;
    margin: 25rpx 0;
  }
  .images {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
  }
  .newsTime {
    font-size: 24rpx;
    color: #999;
  }
  .flex_alls {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .viewImage {
    width: 128rpx;
    height: 128rpx;

    margin: 0 20rpx 0 32rpx;

    flex: 1;
  }
  .viewText {
    flex: 4;
  }
  .flex_box {
    display: flex;
    margin: 25rpx 0;
  }
  .newsTitle {
    font-size: 36rpx;
    font-weight: 600;
    color: #111111;
    margin-top: 10rpx;
  }
  .flex_between_x {
    display: flex;
    justify-content: space-between;
  }
  .Tips {
    font-size: 26rpx;
    padding: 22rpx 0;
    color: #999;
    border-bottom: 1rpx solid #dddddd;
    display: flex;
    justify-content: space-between;
  }
  .TipsText {
    width: 450rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .textIndex {
    width: 40rpx;
    line-height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    background-color: #ff4100;
    margin-right: 32rpx;
    border-radius: 50%;
    color: white;
    font-weight: 300;
  }
</style>
