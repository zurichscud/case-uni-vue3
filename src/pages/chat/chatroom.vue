<template>
  <view class="body_fen">
    <scroll-view
      scroll-y="true"
      enable-back-to-top="true"
      :scroll-top="scrollTop"
      class="total"
      :class="btm ? 'active_total' : ''"
      lower-threshold="10"
      @scrolltolower="lower"
      :style="{
        paddingBottom: keyHeight + 70 + 'px'
      }"
      @scroll="scroll"
      :show-scrollbar="false"
      refresher-enabled="enabled"
      :refresher-triggered="triggered"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
    >
      <view class="total_y" ref="elements">
        <view v-for="(item, i) in dataList" :key="item.id" :id="'item' + item.id">
          <view
            class=""
            style="text-align: center; font-size: 24rpx; color: grey; padding-top: 20rpx"
          >
            {{ item.createTime | futter(dataList[i == 0 ? 0 : i - 1].createTime, i, item) }}
          </view>
          <user-types :list="item" :ref="item" :urls="urlList"></user-types>
        </view>
      </view>
    </scroll-view>

    <view class="paddHr" :style="{ bottom: keyHeight + 'px' }">
      <view class="fixed" style="line-height: 60rpx">
        <input
          :adjust-position="false"
          maxlength="-1"
          :show-confirm-bar="a"
          v-model="inputValue"
          @input="inputText"
          fixed="true"
          class="lineBlock"
          hold-keyboard="true"
          @focus="eventblur"
          @blur="eventforcs"
        />
        <view class="" style="width: 154rpx">
          <image
            src="../../static/img21.png"
            mode=""
            class="falit1"
            v-if="!flay"
            @click="addFile"
          ></image>

          <button v-if="flay" ref="revise" class="falit" @click="send">发送</button>
        </view>
      </view>
      <view class="btnhr" style="padding: 10rpx 10rpx" v-if="btm">
        <view
          class=""
          style="text-align: center; font-size: 24rpx; width: 160rpx"
          :style="{ color: caseInfo == 22 ? '#999' : '#333' }"
        >
          <image
            :src="caseInfo == 22 ? '../../static/img22copy.png' : '../../static/img22.png'"
            mode=""
            class="imgType"
            style="width: 52rpx; padding: 22rpx 28rpx"
            @click="addFild"
          >
          </image>
          <br />上传附件
        </view>
        <view
          style="text-align: center; font-size: 24rpx; width: 160rpx"
          :style="{ color: caseInfo == 22 ? '#999' : '#333' }"
        >
          <image
            :src="caseInfo == 22 ? '../../static/img24copy.png' : '../../static/img24.png'"
            mode=""
            class="imgType"
            @click="addImage"
          >
          </image>
          <br />上传图片
        </view>
        <view
          class=""
          style="text-align: center; font-size: 24rpx; width: 160rpx"
          :style="{ color: caseInfo == 22 ? '#999' : '#333' }"
        >
          <image
            :src="caseInfo == 22 ? '../../static/img23copy.png' : '../../static/img23.png'"
            mode=""
            class="imgType"
            @click="openFile"
          >
          </image>
          <br />查看附件/图片
        </view>
      </view>
    </view>
    <page-container
      :show="true"
      :overlay="false"
      @beforeleave="beforeleave"
      v-if="options.isNew"
    ></page-container>
    <!-- 退出拦截弹框 -->
    <alert ref="intercept">
      <view class="intercept">
        <view class="header"> 对方回复不及时吗？ </view>
        <view class="content_one"> 一键拨打电话，沟通更便捷 </view>
        <view class="content_phone">
          {{ expertPhone }}
        </view>
        <view class="btn_box">
          <view class="quit" @click="quit"> 退出 </view>
          <view class="callPhone" @click="callPhone"> 拨打电话 </view>
        </view>
      </view>
    </alert>
  </view>
</template>
<!-- 357rpx -->
<script>
  import userTypes from './components/userTypes.vue'
  import http from '@/common/api/interface.js'
  import alert from '@/components/alert.vue'
  import dayjs from 'dayjs'
  import { mapState } from 'vuex'
  const msgFixedUrl = [
    'https://app.y9net.cn/data/01/47/wKgBNmZVMTSAJdfvAAHyEYFTH8k979.jpg',
    'https://app.y9net.cn/data/01/47/wKgBNmZVTgCAHxQ8AAJGY8sYbNQ37.jpeg'
  ]
  export default {
    data() {
      return {
        action: '',
        a: false,
        options: {
          caseId: 0
        },
        page: {
          pageNum: 1,
          pagesSize: 50000
        },
        dataList: [],
        imageValue: [],
        flag: false,
        flay: false,
        btm: false,
        btm1: false,
        inputValue: '',
        scrollTop: '999999',
        old: {
          scrollTop: '999999'
        },
        bottom: 0,
        FileList: [],
        timer: '',
        images: [],
        btmmsg: false,
        picadd: 1,
        general: 0,
        total: 0,
        flays: true,
        triggered: true,
        sclTop: 0,
        scllTop: 0,
        offsetHeight: 0, //可见区域高度
        offsetTop: 0, //滚动覆盖的高度
        scrollHeight: 0, //滚动条总高度
        freshing: false,
        enabled: true,
        listId: '',
        listIds: '',
        keyHeight: 0,
        urlList: [],
        flayMsg: true,
        caseInfo: null,
        type: 0,
        expertPhone: 19975373019
      }
    },
    filters: {
      futter(newV, oldV, i, item) {
        if (i == 0) {
          return newV
        }
        if (dayjs(newV).unix() - dayjs(oldV).unix() >= 600) {
          return newV
        }
        if (!!item.ismoll && item.ismoll == 1) {
          return newV
        }

        return ''
      }
    },
    onLoad(options) {
      console.log('我是options数据', options)
      this.options = options
      uni.setNavigationBarTitle({
        title: '聊天室'
      })
      //获取专家联系电话
      this.getExpertPhone()
    },
    onShow() {
      uni.hideLoading()
      this.getList(this.options.caseId)
      uni.onKeyboardHeightChange((res) => {
        this.$nextTick(() => {
          this.keyHeight = res.height
          this.goTop()
        })
      })
    },
    onHide() {
      uni.offKeyboardHeightChange() //取消监听键盘高度变化事件，避免内存消耗
    },
    components: {
      userTypes,
      alert
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      // 获取专家联系电话
      async getExpertPhone() {
        const res = await this.$api.getExpertPhone()
        this.expertPhone = res.data
      },
      // 第一次提交案件退出时进行拦截操作
      beforeleave() {
        if (this.options.isNew) {
          this.$refs.intercept.open()
        }
      },
      quit() {
        uni.navigateBack({
          delta: 1
        })
      },
      callPhone() {
        uni.makePhoneCall({
          phoneNumber: this.expertPhone
        })
        uni.navigateBack({
          delta: 1
        })
      },
      async getCaseInfo(caseId) {
        let res = await this.$api.getCaseMessage({
          caseId
        })
        this.caseInfo = res.data?.answer2ServiceItem
        this.type = res.data.type
      },
      openFile() {
        if (this.caseInfo == 22 || [7, 8].includes(this.type)) return this.$toast('无法使用此功能')
        uni.navigateTo({
          url: '/pages/chat/files?caseId=' + this.options.caseId
        })
      },
      async dataFilter() {
        let { datas } = await this.$api.selectPhotoUploadByCaseChat({
          caseId: this.options.caseId
        })
        let url = []
        datas.forEach((el) => {
          url.push(el.photoUrl)
        })
        this.urlList = [...msgFixedUrl, ...url]
      },
      // 上传图片
      addImage() {
        if (this.caseInfo == 22 || [7, 8].includes(this.type)) return this.$toast('无法使用此功能')
        let that = this
        uni.chooseImage({
          count: 1,
          success(imgs) {
            console.log('图片', imgs)
            imgs.tempFilePaths.forEach((el, i) => {
              uni.compressImage({
                src: el,
                quality: 30,
                success: (resImg) => {
                  const uploadTask = uni.uploadFile({
                    url: http.config.baseUrl + 'iclaim/user/photoUpload2', //仅为示例，非真实的接口地址
                    filePath: resImg.tempFilePath,
                    header: {
                      Authorization: `Bearer ${uni.getStorageSync('user')?.token}`
                    },
                    name: 'photo',
                    success: async (uploadFileRes) => {
                      let res = await that.$api.photoUploadByCaseChat({
                        photo: JSON.parse(uploadFileRes.data).data,
                        userId: that.options.userId,
                        caseId: that.options.caseId
                      })
                      if (i == imgs.tempFilePaths.length - 1) {
                        if (res.message == '上传文件，保存记录成功') {
                          uni.showToast({
                            title: '图片上传成功',
                            duration: 2000
                          })
                          console.log('上传图片')
                          that.sends(3, JSON.parse(uploadFileRes.data).data)
                        } else {
                          uni.showToast({
                            title: '图片上传失败',
                            icon: 'error',
                            duration: 2000
                          })
                        }
                      }
                    }
                  })
                }
              })
            })
          }
        })
      },

      // 上传文件
      addFild() {
        if (this.caseInfo == 22 || [7, 8].includes(this.type)) return this.$toast('无法使用此功能')
        let that = this
        wx.chooseMessageFile({
          count: 1, //默认100
          type: 'all',
          success: function (res) {
            let strFiles = JSON.stringify(res.tempFiles)
            let strname = res.tempFiles[0].name
            let lexin = res.tempFiles[0].path.split('.')[1]
            if (lexin == 'docx' || lexin == 'doc' || lexin == 'pdf') {
              // iclaim/mewExpert/photoUploadByChat2
              const uploadTask = uni.uploadFile({
                url: http.config.baseUrl + 'iclaim/user/upload/file', //仅为示例，非真实的接口地址
                filePath: res.tempFiles[0].path,
                name: 'file',
                success: async (uploadFileRes) => {
                  let strFiles = JSON.parse(uploadFileRes.data).data
                  let res = await that.$api.fileUploadByCaseChat({
                    file: strFiles.url,
                    name: strname,
                    userId: that.user.id,
                    caseId: that.options.caseId
                  })

                  if (res.message == '上传文件，保存记录成功') {
                    uni.showToast({
                      title: '文件上传成功',
                      duration: 2000
                    })

                    that.sends(2, strFiles.url + ',' + strname)
                  } else {
                    uni.showToast({
                      title: '文件上传失败',
                      icon: 'error',
                      duration: 2000
                    })
                  }
                }
              })
            } else {
              uni.showToast({
                title: '上传格式不正确！',
                icon: 'error',
                duration: 2000
              })
            }
          }
        })
      },

      async total_y() {
        this.btm1 = !this.btm1
        this.btm = false
        if (this.btm1) {
          this.getimgs()
        }
        // let res =  await  this.$api.photoImg({caseId:this.options.caseId})
      },

      // 第一次获取消息
      async getList(data) {
        const { rows, code, total } = await this.$api.newMessageList(`?pageNum=1&pageSize=20`, {
          caseId: data,
          userId: this.user.id
        })
        this.total = total
        let list = rows.reverse()
        list.length != 0 &&
          (() => {
            list[0].ismoll = 1
          })()
        this.dataList = list
        await this.dataFilter()

        this.general = this.dataList.length
        this.timer = setInterval(() => {
          this.listData(this.options.caseId)
        }, 5000)
        if (!this.options.isNew) {
          this.$nextTick(() => {
            this.goTop()
          })
        }
      },
      // 一直获取总数
      async listData(data) {
        // 获取当前total
        const res = await this.$api.newGetCount(data)
        let total = res.data.count
        if (total > this.total) {
          let pics = total - this.total
          this.total = total
          this.getLists(pics)
        }
      },
      // 发送消息
      async getLists(pics, my) {
        const { rows, code, total } = await this.$api.newMessageList(
          `?pageNum=1&pageSize=${pics}`,
          {
            caseId: this.options.caseId,
            userId: this.user.id
          }
        )
        let list = rows.reverse()
        this.dataList.push(...list)
        await this.dataFilter()
        this.general = this.dataList.length
        if (this.scrollHeight <= this.offsetTop + this.offsetHeight + 40) {
          console.log(this.scrollHeight, this.offsetTop, this.offsetHeight)
          this.goTop()
        }
        if (my == 'my') {
          console.log('发送消息')
          this.flayMsg = true
          this.goTop()
        }
      },
      // 顶部
      upper: async function (e) {
        let that = this
        console.log(this.total, this.general)
        if (this.total > this.general) {
          this.flays = false

          const { rows, code, total } = await this.$api.getNewPillList({
            caseId: this.options.caseId,
            general: this.general
          })

          let list = rows.reverse()

          this.listIds = list.find((item, i) => {
            return i == list.length - 1
          })
          list.length != 0 &&
            (() => {
              list[0].ismoll = 1
            })()
          this.dataList.unshift(...list)
          await this.dataFilter()
          this.general = this.dataList.length
          setTimeout(() => {
            that.triggered = false
            console.log('下拉刷新被复')
            that.freshing = false
          }, 300)
          this.listId = 'item' + this.listIds.id
        } else {
          // uni.showToast({
          // 	title:'消息已经加载完了',
          // 	duration:2000
          // })
          this.enabled = false
          setTimeout(() => {
            that.triggered = false
          }, 300)
        }
      },
      // //失去焦点
      eventforcs() {
        // this.flag = true

        if (this.flag) {
          this.flag = false
        }
      },
      // 获取焦点
      eventblur() {
        uni.onKeyboardHeightChange((res) => {
          this.$nextTick(() => {
            this.keyHeight = res.height
            this.goTop()
          })
        })
        this.btm = false
        this.flag = true
      },
      // input事件
      inputText() {
        if (this.inputValue == '') {
          this.flay = false
        } else {
          this.flay = true
        }
      },
      // fa送按钮
      async send() {
        if (this.flayMsg) {
          this.flayMsg = false
          this.total += 1
          if (this.inputValue == '') {
          } else {
            let res = await this.$api.newMessageSave({
              content: this.inputValue,
              caseId: this.options.caseId,
              type: '1',
              userId: this.user.id,
              msgType: 1
            })
            if (res.code == 200) {
              this.inputValue = ''
              this.flag = false
              this.flay = false
              await this.getLists(1, 'my')
            } else {
            }
          }
        }
      },
      async sends(num, url) {
        this.total += 1
        let res = await this.$api.newMessageSave({
          content: url,
          caseId: this.options.caseId,
          type: '1',
          userId: this.user.id,
          msgType: num
        })
        if (res.code == 200) {
          this.flag = false
          this.flay = false
          await this.getLists(1, 'my')
        } else {
        }
      },

      async addFile() {
        uni.hideKeyboard()
        if (this.btm) {
          this.btm = false
          this.flag = false
        } else {
          this.btm = !this.btm
        }
        this.$nextTick(() => {
          this.goTop()
        })
      },

      lower: function (e) {
        // console.log(e)
        this.$nextTick(() => {
          this.btmmsg = false
        })
      },
      scroll: function (e) {
        this.scrollHeight = e.detail.scrollHeight
        this.offsetTop = e.detail.scrollTop
        if (this.sclTop == 0) {
          this.offsetHeight = e.detail.scrollHeight - e.detail.scrollTop
          this.$nextTick(() => {
            // 刚进入页面页面高度，和滚动过后页面高度不一致，所以初始化之后需要再次调用这个方法
            // this.goTop()
          })
        }
        this.sclTop++
        this.old.scrollTop = e.detail.scrollTop
      },
      goTop: function (e) {
        // 解决view层不同步的问题
        this.scrollTop = this.old.scrollTop
        this.$nextTick(function () {
          this.scrollTop = 9999999
        })
      },
      onPulling(e) {
        this.triggered = true
        if (!this.enabled) {
          //   uni.showToast({
          // 	title:'消息已经加载完了',
          // 	duration:2000
          // })

          setTimeout(() => {
            this.triggered = false
          }, 2000)
        }
      },
      onRefresh() {
        if (this.freshing) return
        this.freshing = true
        if (!this.triggered) {
          this.triggered = true
        }

        console.log('下拉刷新被触发')
        this.upper()
      },
      onRestore() {
        this.triggered = false // 需要重置
        console.log('下拉刷新被复位')
      },
      onAbort() {
        console.log('下拉刷新被终止')
      }
    },

    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>
<!-- 420rpx -->
<style lang="scss" scoped>
  .intercept {
    text-align: center;
    width: 530rpx;
    .header {
      color: #1c2023;
      font-size: 42rpx;
      margin-top: 30rpx;
      padding-left: 26rpx;
    }
    .content_one {
      color: #8b8c90;
      margin: 18rpx 0;
      font-size: 35rpx;
    }
    .content_phone {
      color: #1c2023;
      margin-top: 50rpx;
      margin-bottom: 80rpx;
      font-size: 35rpx;
    }
    .btn_box {
      display: flex;
      justify-content: space-between;
      margin: 40rpx 0 10rpx 0;
      .quit {
        box-sizing: border-box;
        width: 250rpx;
        height: 90rpx;
        border-radius: 400rpx;
        border: 4rpx solid #75a7fe;
        line-height: 86rpx;
        font-size: 36rpx;
        color: #75a7fe;
      }
      .callPhone {
        box-sizing: border-box;
        width: 250rpx;
        height: 90rpx;
        border-radius: 400rpx;
        line-height: 90rpx;
        background: linear-gradient(134deg, #f8faff 0%, #78b9fd 0%, #644dff 100%);
        color: white;
        font-size: 36rpx;
      }
    }
  }
  .filterGrey {
    filter: grayscale(100%);
  }

  .images {
    position: relative;
    top: -10rpx;
    width: 60rpx;
    height: 60rpx;
    margin: 20rpx;
    margin-right: 0rpx;
  }

  .imgType {
    height: 60rpx;
    width: 60rpx;
    background-color: white;

    border-radius: 10rpx;
    padding: 24rpx 24rpx;
  }

  .imgs {
    width: 200rpx;
    font-size: 30rpx;
    color: #dedede;
    background-color: #f4f5f6;
    display: inline-block;
    margin: 10px;
    border-radius: 5rpx;
    height: 75rpx;
  }

  .imageUrl {
    width: 200rpx;
    height: 200rpx;
    margin: 10rpx 20rpx;
  }

  .active_total {
    padding-bottom: 340rpx !important;
  }

  .total {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .totalsY {
    padding-bottom: 320rpx !important;
  }

  .total_y {
    padding: 0rpx 30rpx;
  }

  .falit {
    position: relative;
    font-size: 25rpx;
    background-color: #3f9cff;
    color: white;
    width: 140rpx;
    height: 70rpx;
    line-height: 70rpx;
    margin: 20rpx;
    margin-left: 2rpx;
    top: 0rpx;
    border-radius: 20rpx;
  }

  .falit1 {
    position: relative;
    top: 25rpx;
    left: 20rpx;
    width: 60rpx;
    height: 60rpx;
  }

  .zuoLi {
    display: flex;
    justify-content: flex-start;
  }

  // 112px
  // 224rpx
  //
  .btnhr {
    border-top: 1px solid #8080803d;
    padding-bottom: 50rpx !important;
    color: grey;
    display: flex;
  }

  .lookfile {
    color: rgb(153, 137, 186);
    line-height: 60rpx;
  }

  .fixed_bottoms {
    display: flex;
    justify-content: space-between;
  }

  .tips_flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #c5c5c5;
    margin: 20rpx 0;

    .hr_text {
      width: 215rpx;
      height: 1rpx;
      background-color: #c5c5c5;
      margin-top: 15rpx;
    }
  }

  .paddHr {
    width: 100%;
    background-color: white;
    position: fixed;
    box-sizing: border-box;
    background-color: #f9f9f9;
    // padding:10rpx 10rpx 30rpx 10rpx ;
    // padding: 40rpx 0 0rpx 0;
    // padding-bottom: constant(safe-area-inset-bottom);  // 苹果底部的安全距离
    // 	padding-bottom: env(safe-area-inset-bottom);       // 苹果底部的安全距离
  }

  .posabst {
    position: absolute;
    top: -44rpx;
    left: 21rpx;
    color: red;
    font-size: 28rpx;
  }

  .body_fen {
    height: 100vh;
    background-color: rgb(246, 243, 247);
    overflow: hidden;
  }

  .fixed {
    // padding: 0px 10rpx;
    display: flex;
    justify-content: space-between;
    // border-bottom: 1px solid grey;
    // height: 120rpx;

    // padding: 10rpx 10rpx;
  }

  .lineBlock {
    display: inline-block;
    margin: 20rpx;
    border-radius: 40rpx;
    background-color: white;
    padding: 10rpx;
    border-radius: 20rpx;
    width: 520rpx;
    height: 50rpx;
    font-size: 38rpx;
    position: relative;
    top: -10rpx;
    left: 20rpx;
    margin-top: 30rpx;
    // box-sizing: border-box;
  }

  .widImg {
    width: 160rpx;
    height: 60rpx;
    border-radius: 6rpx;
  }

  .btnStyle {
    width: 200rpx;
    font-size: 30rpx;
    color: rgb(222, 222, 222);
    background-color: rgb(244, 245, 246);
  }

  .icTian {
    position: relative;
    top: -10rpx;
    margin-right: 10rpx;
    line-height: 100rpx;
  }

  .textadd {
    color: blue;
    padding: 20rpx;
    text-decoration: underline;
  }
</style>
