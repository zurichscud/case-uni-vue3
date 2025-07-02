<template>
  <view class="questionChat">
    <view class="chatList" v-if="chatMsg.length >= 2">
      <scroll-view
        scroll-y="true"
        :style="{ height: scrollH + 'px', overflow: 'auto' }"
        upper-threshold="-50"
        :scroll-into-view="toView"
      >
        <view class="message" v-for="(item, index) in chatMsg" :key="index" :id="'main' + index">
          <!-- 用户端 用户在右边 -->
          <view class="main" :class="[item.type == 1 ? 'textRight' : '']" v-if="item.type != 4">
            <block>
              <image
                v-if="item.type == 3"
                class="avatar"
                style="margin-right: 20rpx"
                src="https://app.y9net.cn/images/imgs/icon_xiaoyi3.png"
              />
              <image
                v-else-if="item.type == 1"
                class="avatar"
                style="float: right; margin-left: 20rpx"
                src="https://app.y9net.cn/data/00/03/photo/man.png"
              />
              <image
                v-if="item.type == 2"
                class="avatar"
                style="margin-right: 20rpx"
                :src="item.expertPhoto"
              />
            </block>
            <view :class="[item.type == 1 ? 'userYour' : 'user']">
              <!-- 昵称处理 -->
              <text v-if="item.type == 1" class="user-text">我</text>
              <text v-else-if="item.type == 3" class="user-text">晓弈</text>
              <text v-else-if="item.type == 1" class="user-text">{{ item.userName }}</text>
              <text v-else-if="item.type == 2" class="user-text">{{ item.expertName }}</text>
            </view>
            <view :class="[item.type == '1' ? 'colorRight' : 'colorLeft', 'msgBg', 'msg']">
              <view class="template msg-text questions" style="float: left">
                <rich-text @tap="naoTo(item)" :nodes="item.msg"></rich-text>
              </view>
            </view>
          </view>
          <view class="" style="padding: 32rpx 0" v-if="item.type == 4">
            <rich-text :nodes="item.msg"></rich-text>
          </view>
        </view>
        <!-- <view style="height: 160rpx;"></view> -->
      </scroll-view>
    </view>
    <!-- type：1普通input 2填空 3 单选，4多选 -->
    <!-- <view class="answer">
			<view v-if="lastQ.type==1" class="input">
				<input type="text" >
			</view>
		</view> -->
  </view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  // #ifdef H5
  import textButton from '@/components/fixed/textButton'
  // #endif
  import vFixed from '@/components/fixed/fixed'

  export default {
    components: {
      // #ifdef H5
      textButton,
      // #endif
      vFixed
    },

    props: {},
    computed: {
      ...mapState(['chatMsg'])
    },
    data() {
      return {
        user: this.$store.state.user,
        scrollH: '600',
        lastQ: {}, //最后一个问题类型
        toView: '' //定位到id选择器处
      }
    },
    watch: {
      // 监听答案盒子变化
      '$store.state.chatInputH': function (newFlag, oldFlag) {
        console.log('jiantingyouxiao', newFlag)
        this.getmsgH(newFlag)
      },
      //更新聊天消息
      chatMsg: function (newFlag, oldFlag) {
        if (newFlag) {
          this.$nextTick(function () {
            this.toView = `main${this.chatMsg.length - 1}`
          })
        }
      }
    },
    onLoad() {
      let that = this
      this.getmsgH(this.$store.state.chatInputH)
      this.$nextTick(function () {
        this.toView = `main${this.chatMsg.length - 1}`
      })
	},
    methods: {
      naoTo(item) {
        console.log(item)
        if (item.pdf) {
          let url = item.msg.split(',')
          this.download(item.url)
        }
      },
      // 查看附件
      download(url) {
        // let url = 'https://app.y9net.cn/data/01/38/wKgBNmPlmw-AGMZUAAHMGuVctV0982.pdf'
        uni.downloadFile({
          url: url,
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
      // 获取聊天界面的高度
      getmsgH(value) {
        this.scrollH = this.$isIphoneX
          ? this.$screenH - value - 44 - 20
          : this.$screenH - value - 44 - 20
        console.log('滚动高度', this.scrollH)
        this.scrollH -= 30
        uni.getSystemInfo({
          success(res) {
            console.log(res)
            if (res.platform != 'android') {
              // this.scrollH = this.scrollH-30
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .addMsg_voice image {
    width: 36rpx;
    height: 36rpx;
  }

  .addMsg image {
    width: 40rpx;
    height: 40rpx;
  }

  .text-input {
    width: 100%;
    height: 100rpx;
    padding: 0;
    display: block;
  }

  .news {
    width: 100%;
    height: 62rpx;
    font-size: 14px;
    padding-left: 20rpx;
    display: inline-block;
    line-height: 48rpx;
    position: relative;
    top: 0;
  }

  .bgEx {
    background-color: #0091ea;
  }

  .bg {
    background-color: #ff821d;
  }

  .send_btn {
    width: 120rpx;
    height: 60rpx;
    line-height: 60rpx;
    color: #fff;
    padding: 0;
    display: inline-block;
    float: right;
    border-radius: 30rpx;
    text-align: center;
  }

  .f-row {
    padding: 0 30rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
  }

  .cancat {
    position: fixed;
    right: 0;
    bottom: 184rpx;
  }

  .cancat image {
    width: 128rpx;
    height: 118rpx;
  }

  .chatList {
    padding: 0 30rpx;
  }

  .keywords {
    background: #f5f6f9;
    width: 100%;
    white-space: nowrap;
    padding: 30rpx 0;
  }

  .keywords .item {
    margin-right: 20rpx;
    padding: 10rpx 26rpx;
    display: inline-block;
    border-radius: 30px;
    border: 2rpx solid $uni-text-color-inverse;
    color: $uni-text-color-inverse;
  }

  .keywords .paddLeft {
    margin-left: 30rpx;
  }

  .userYour {
    position: relative;
  }

  .user {
    position: relative;
    bottom: 0rpx;
    right: 0rpx;
  }

  .user .user-text {
    font-size: 24rpx;
    color: #888888;
  }

  .avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 6rpx;
    float: left;
    border-radius: 50%;
  }

  .questions {
    max-width: 460rpx;
  }

  .title {
    padding-bottom: 28rpx;
    border-bottom: 1px solid #e5e5e5;
  }

  .title .left {
    font-weight: 700;
  }

  .title image {
    margin-right: 12rpx;
    vertical-align: bottom;
  }

  .title .left image {
    width: 40rpx;
    height: 40rpx;
  }

  .title .right {
    font-size: 24prx;
    color: #888;
  }

  .title .right image {
    width: 32rpx;
    height: 30rpx;
  }

  .content {
    color: #418acf;
    font-size: 28rpx;
    line-height: 40rpx;
  }

  .content .item {
    width: 100%;
    padding-bottom: 20rpx;
  }

  .content .item:last-child {
    padding-bottom: 0;
  }

  page,
  uni-app,
  .questionChat {
    background: $uni-bg-color-grey;
    height: 100%;
    width: 100%;
  }

  .radioReset .uni-radio-wrapper .uni-radio-input {
    background: red;
  }

  .msgCenter {
    margin-top: 50rpx;
    padding-bottom: 80rpx;
  }

  .singleBox {
    padding: 40rpx 34rpx;

    .item {
      margin-bottom: 30rpx;
      padding-left: 36rpx;
      padding-right: 36rpx;
    }

    .item0 {
      width: 324rpx;
      text-align: center;
    }
  }

  .itemPublic {
    display: inline-block;
    background: rgba(94, 181, 169, 0.08);
    border-radius: 12rpx;
    color: $uni-text-color-inverse1;
    padding-top: 15rpx;
    padding-bottom: 15rpx;
    margin-right: 30rpx;
  }

  .itemPublic:last-child {
    margin-right: 0;
    margin-bottom: 0;
  }

  .confirm_btn {
    display: inline-block;
    width: 690rpx;
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    background: $uni-text-color-inverse;
    color: #fff;
    border-radius: 12rpx;
  }

  .daysBox {
    .right {
    }

    // height: 132rpx;line-height: 132rpx;
    .daysBoxTop {
      height: 132rpx;
      line-height: 132rpx;
      padding: 0 30rpx;
    }

    .publicBtn {
      margin-right: 20rpx;
      width: 36rpx;
      color: $uni-text-color-inverse;
      height: 36rpx;
      border: 2rpx solid $uni-text-color-inverse;
    }

    .reduce {
    }

    .rightInput {
      text-align: center;
      width: 120rpx;
      height: 60rpx;
      background: rgba(94, 181, 169, 0.08);
      border-radius: 12rpx;
    }

    .add {
      margin-left: 20rpx;
    }
  }

  .disabled {
    color: #656565;
    background: rgba(28, 37, 42, 0.07);
  }

  .chatAnswer {
    background: #fff;
    max-height: 900rpx;
    overflow-y: auto;
  }

  .answerContent {
    height: 300rpx;

    .item {
      line-height: 50px;
      text-align: center;
    }
  }

  .label {
    text-align: right;
    color: $uni-text-color-inverse;
    font-size: 24rpx;
  }

  .submit {
    text-align: right;

    view {
      color: $uni-text-color-inverse;
      padding: 30rpx 40rpx;
    }
  }

  .imgTop {
    width: 100%;
  }

  .scroll_view {
    margin-top: 60rpx;
    margin-bottom: 174rpx;
  }

  .scroll_view_change {
    margin-top: 60rpx;
    margin-bottom: 174rpx;
  }

  .paddTop {
    padding-top: 90rpx;
  }

  .paddNone {
    padding: 0;
  }

  .scroll_view_X,
  .scroll_view_change_X {
    margin-bottom: 244rpx;
  }

  .scroll_view_change {
    /*bottom: 440rpx;*/
    margin-bottom: 590rpx;
  }

  .message {
    // margin-top: 40rpx;
    width: 100%;
    height: auto;
    // padding: 0 30rpx;
    position: relative;
  }

  // 发送的消息非img

  .msg {
    display: inline-block;
    // max-width: calc(85% - 80rpx);
    min-height: 40rpx;
    font-size: 32rpx;
    /*overflow: hidden;*/
    text-align: left;
    word-break: break-all;
    // background-color: #fff;
    // border-radius:0 40rpx 40rpx 40rpx;
    position: relative;
    margin-top: 20rpx;
    max-width: 75%;
  }

  .msg .msg-text {
    line-height: 40rpx;
    font-size: 32rpx;
    margin: 0;
  }

  .msgBg {
    box-shadow: 0px 0px 12rpx 2rpx rgba(204, 227, 244, 0.5);
    // border-radius:40rpx 0px 40rpx 40rpx;
    padding: 30rpx 30rpx;
    background-color: #fff;
    border-radius: 0 40rpx 40rpx 40rpx;
  }

  .textRight {
    text-align: right;
  }

  .colorRight {
    background: $uni-text-color-inverse;
    border-radius: 40rpx 0rpx 40rpx 40rpx;
    color: #fff;
  }

  .colorLeft {
    background: #fff;
  }

  .self .msg:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #b2e281;
  }

  .template {
    display: inline;
  }
</style>
