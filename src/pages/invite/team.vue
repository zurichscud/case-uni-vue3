<!-- 团队成员 -->
<template>
  <view class="" style="">
    <view class="top_box">
      <view class="box_show">
        <image class="images_title" src="../../static/img40.png" mode=""></image>
        <text class="text_title">团队人数</text
        ><text class="titleIndex">{{ dataList.length + 1 }}</text>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scrollY" @scrolltolower="scrollbtm">
      <invitepersonal class="margHight" :item="member" v-if="!!member"></invitepersonal>
      <view class="margHight" v-for="(item, i) in dataList" :key="i">
        <invitepersonal :item="item"></invitepersonal>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import invitepersonal from './components/invitepersonal.vue'
  export default {
    data() {
      return {
        dataList: [],
        options: {},
        paging: {
          pageNum: 1,
          pageSize: 20
        },
        member: null,
        count: null
      }
    },
    components: {
      invitepersonal
    },
    computed: {
      ...mapState(['user'])
    },
    onLoad(options) {
      this.options = options
      uni.setNavigationBarTitle({
        title: options.username + '的团队'
      })
      this.fetchData()
    },
    methods: {
      scrollbtm() {
        if (this.count >= this.dataList.length) {
          this.paging.pageNum++
          this.fetchData()
        }
      },
      async fetchData() {
        let { data } = await this.$api.inviteMemberByLeader(
          Object.assign(
            {
              userId: this.options.id * 1,
              pid: this.user.id
            },
            this.paging
          )
        )
        this.member = data.member
        console.log(this.member)
        this.dataList.push(...data.list)
      }
    }
  }
</script>

<style scoped lang="scss">
  .top_box {
    display: flex;
    justify-content: space-between;
    margin: 20rpx 0;
    padding: 0 24rpx;
  }

  .scrollY {
    padding: 0rpx 24rpx;
    // background-color: gray;
    width: 100%;
    height: 88vh;
    box-sizing: border-box;

    .margHight {
      margin-top: 20rpx;
    }
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
</style>
