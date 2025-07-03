<template>
  <!-- 打开 -->
  <view class="questionChat">
    <v-chatmsg></v-chatmsg>
    <v-chatbar :basic="options" @submit="submit"></v-chatbar>
    <alert ref="child" btn="2" btnName2="我知道了" @submit="nav('case')" auto="false">
      <view class="alertC">
        <!-- <view class="title">案件编号:{{caseId}}</view> -->
        <view class="con" style="font-weight: bold; font-size: 34rpx">案件已提交</view>
        <view class="con">理赔公社专家将在2小时内与您沟通<br />案件详情</view>
      </view>
    </alert>
  </view>
</template>

<script>
  import alert from '@/components/alert.vue'
  import vChatmsg from './components/chatmsg.vue'
  import vChatbar from './components/chatbar.vue'

  export default {
    components: {
      vChatbar,
      // vOrdertime,
      vChatmsg,
      alert
    },
    data() {
      return {
        options: { caseId: 0 },
        caseId: '', //案件编号
        isCheck: true
      }
    },
    computed: { ...mapState(['user']) },
    onLoad(options) {
      this.options = options
      this.papeInit()

      uni.setNavigationBarTitle({
        title: '聊天室'
      })
    },
    onShow() {},
    methods: {
      ...mapMutations(['setUser']),
      close() {
        // if(!this.isCheck){
        // 	this.$toast('请阅读并选择隐私协议')
        // 	return false
        // }
      },
      papeInit() {},
      //提交订单 其实就是修改订单状态为正常
      async submit(data) {
        this.caseId = data.caseId
        let res = await this.$api.updateCase({ statu: 1, caseId: data.caseId })
        if (res.code == 200) {
          this.$refs.child.open()
        }
      },
      nav(name) {
        console.log('我是案件跳转的caseid')
        uni.redirectTo({
          url: `/pages/deprecated/chatroom?caseId=${this.caseId}&userId=${this.user.id}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*checkbox选中后样式  */
  checkbox .uni-checkbox-input.uni-checkbox-input-checked {
    background: $uni-text-color-inverse;
  }
  .questionChat {
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  /*checkbox选中后图标样式  */
  checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
    width: 28rpx;
    height: 28rpx;
    line-height: 28rpx;
    text-align: center;
    font-size: 22rpx;
    color: #fff;
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
  }

  /* #ifdef APP-PLUS || MP-WEIXIN */
  checkbox .wx-checkbox-input {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
  }

  /*checkbox选中后样式  */
  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    background: $uni-text-color-inverse;
  }

  /*checkbox选中后图标样式  */
  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    width: 28rpx;
    height: 28rpx;
    line-height: 28rpx;
    text-align: center;
    font-size: 22rpx;
    color: #fff;
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
  }

  /* #endif */
  /* form begin */
  .inputItems {
    &_item {
      border-bottom: 1px solid #B7C4CB;
      padding: 25rpx 0;
      input {
        width: 280rpx;
        display: inline-block;
        padding: 0 10rpx 0 26rpx;
      }
      &_inputBtn {
        font-size: 28rpx;
        color: $uni-text-color-inverse;
      }
      &_label {
        font-size: 24rpx;
        color: $uni-text-color-grey;
        margin-top: 26rpx;
      }
      &_checkbox {
      }
      &_btn {
        font-size: 24rpx;
        color: #418acf;
      }
    }
    &_itemBtns {
      margin-top: 75rpx;
      button {
        background: $uni-text-color-inverse;
        border-radius: 100rpx;
        color: #fff;
      }
    }
  }
  /* form over */
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
