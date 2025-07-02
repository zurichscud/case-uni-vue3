<!-- 互动消息 -->
<template>
  <view class="">
    <view class="" v-if="dataList.length == 0">
      <none name="暂无最新消息~"></none>
    </view>
    <view class="padd_btm" v-else>
      <view
        class=""
        v-for="(item, i) in dataList"
        :key="i"
        @longtap="onLongPress(item.caseId)"
        @click="navTo(item)"
      >
        <view class="flex_box">
          <view class="viewImage">
            <image :src="item.photoExpert" mode="" class="images"></image>
          </view>
          <view class="viewText">
            <view class="flex_alls">
              <view class="newsTitle"> 案件编号:{{ item.caseId }} </view>
              <view class="newsTime" style="margin-right: 32rpx">
                {{ item.gmtCreate | time }}
              </view>
            </view>
            <view class="Tips">
              <view class="TipsText">
                {{ item.content }}
              </view>
              <view class="textIndex" v-if="!!item.counts != 0">
                {{ item.counts }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        value: {},
        dataList: []
      }
    },
    filters: {
      time(time) {
        //获取今天的零点时间戳
        let todayTimer = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
        //这个也可以获取零点的时间
        // let todayTimer=new Date(new Date().toLocaleDateString()).getTime()/1000;
        //获取昨天零点的时间戳
        let yesterdayTimer = todayTimer - 3600 * 24
        //获取今天的日期字符串
        let todayData = dayjs().format('YYYY-MM-DD')
        let timer = dayjs(time).unix()
        if (dayjs(time).format('YYYY-MM-DD') === todayData) {
          return '今天'
        } else if (timer < todayTimer && timer >= yesterdayTimer) {
          return '昨天'
        } else {
          return dayjs(time).format('YYYY-MM-DD')
        }
      }
    },
    onLoad() {
      let value = uni.getStorageSync('user')
      this.value = value
    },
    onShow() {
      this.getMessageTypeList()
    },
    methods: {
      onLongPress(caseId) {
        let that = this
        uni.showModal({
          // 弹框询问是否进行下一步事件
          title: '提示',
          content: '是否删除该记录',
          success: async function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              let { code } = await that.$api.deletedMessage({
                caseId: caseId,
                category: 2,
                userId: that.value.id
              })
              if (code == 200) {
                that.getMessageTypeList()
              } else {
                uni.showToast({
                  duration: 2000,
                  title: '删除失败'
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
              return
            }
          }
        })
      },
      async getMessageTypeList() {
        let { rows } = await this.$api.getMessageTypeList({
          category: 2,
          userId: this.value.id
        })
        this.dataList = rows
      },
      navTo(item) {
        const path = item.type == 1 ? '/pages/deprecated/chatroom' : '/pages/chat/chatroom'
        uni.navigateTo({
          url: `${path}?caseId=${item.caseId}&userId=${this.value.id}`,
          fail(e) {
            console.log(e)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .padd_btm {
    padding-bottom: 50rpx;
  }

  .text {
    text-align: center;
    color: #666;
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
    color: #666;
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
    color: black;
    margin-top: 10rpx;
  }

  .flex_between_x {
    display: flex;
    justify-content: space-between;
  }

  .Tips {
    font-size: 26rpx;
    padding: 22rpx 0;
    color: #666;
    border-bottom: 1rpx solid #dddddd;
    display: flex;
    justify-content: space-between;
  }

  .TipsText {
    width: 450rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
