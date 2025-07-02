<!-- 兵棋推演 -->
<template>
  <view class="p20">
    <!-- <view class="image_container">
			<image class="imageBan" src="https://app.y9net.cn/data/01/45/wKgBNmW7XaeAdVomABFRNYyluMk808.png" mode=""></image>
		</view> -->
    <view class="activity_title font_bold">最新一期</view>
    <activityList
      :dictionaryList="dictionaryList"
      :arrObj="dataList[0]"
      v-if="dataList.length != 0"
    ></activityList>
    <view class="activity_title font_bold">往期活动</view>
    <view class="mb-30" v-for="(item, index) in dataList" :key="index" v-if="index !== 0">
      <activityList :dictionaryList="dictionaryList" :arrObj="item"></activityList>
    </view>

    <view class="text_center fz_24"> 暂无更多活动～ </view>
  </view>
</template>

<script>
  import activityList from './components/activity-list.vue'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        dictionaryList: [],
        dataList: []
      }
    },
    components: {
      activityList
    },
    onLoad() {
      this.initData()
      this.dictionary()
    },
    onShareAppMessage(res) {
      return {
        title: '兵棋推演火热进行中!',
        imageUrl: 'https://app.y9net.cn/data/01/45/wKgBNmW7XaeAdVomABFRNYyluMk808.png',
        success(res) {
          console.log('分享成功', res)
        }
      }
    },
    onShareTimeline() {
      return {
        title: '兵棋推演火热进行中!'
      }
    },
    methods: {
      async initData() {
        let res = await this.$api.getGameWarsList({})
        this.dataList = res.rows.map((el) => {
          el.commentDeadline = dayjs(el.commentDeadline).format('YYYY-MM-DD')
          return el
        })
      },
      async dictionary() {
        let res = await this.$api.getSysDictData({
          dictType: 'sys_mcd_status'
        })
        this.dictionaryList = res.rows
      }
    }
  }
</script>

<style scoped lang="scss">
  $publicColor: #3f9cff;

  .activity_title {
    font-size: 36rpx;
    margin: 20rpx 0;
  }

  .image_container {
    width: 100%;
    height: 300rpx;
    background-color: $publicColor;
    border-radius: 20rpx;
    overflow: hidden;
  }

  .imageBan {
    width: 100%;
    height: 100%;
  }
</style>
