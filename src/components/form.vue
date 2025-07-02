<template>
  <view>
    <!-- login组件 -->
    <form class="inputItems" @submit="setSubmitFun" action="">
      <block v-for="(item, index) in form1.inputItems" :key="index">
        <view :class="['flex_y', item.type == 'input' ? 'inputItems_item' : '']">
          <block v-if="item.type == 'input'">
            <text class="name_label">{{ item.name }}</text>
            <!-- 设置密码 -->
            <input
              :name="item.nameEng"
              v-if="item.nameEng == 'password'"
              :class="[item.placeholder == '请输入密码' ? '' : 'langInput']"
              password
              type="text"
              :placeholder="item.placeholder"
              :value="item.value"
              @input="setModel($event, index)"
            />
            <!-- 验证码最长6位 限制于ios系统复制会双份 -->
            <input
              :name="item.nameEng"
              v-else-if="item.nameEng == 'vcode'"
              type="text"
              maxlength="6"
              :placeholder="item.placeholder"
              :value="item.value"
              @input="setModel($event, index)"
            />
            <input
              :name="item.nameEng"
              v-else
              type="text"
              :placeholder="item.placeholder"
              :value="item.value"
              @input="setModel($event, index)"
            />
            <!-- 密码或者倒计时按钮 -->
            <text
              class="inputItems_item_inputBtn"
              v-if="item.button && !authtime"
              @click="setInputFn(index)"
              >{{ item.button }}</text
            >
            <!-- 倒计时时间 -->
            <text class="inputItems_item_inputBtn" v-else-if="item.button && authtime"
              >{{ authtime }}s</text
            >
          </block>

          <block v-if="item.type == 'checkbox'">
            <checkbox-group class="inputItems_item_label" :name="item.nameEng" @change="checkedbul">
              <view>
                <checkbox
                  class="inputItems_item_checkbox"
                  :value="item.value"
                  :checked="item.checked"
                />{{ item.name }}
                <text class="inputItems_item_btn" @click="toDocument(1)">{{ item.button }}</text
                >和<text class="inputItems_item_btn" @click="toDocument(2)">{{
                  item.button1
                }}</text>
              </view>
            </checkbox-group>
          </block>
        </view>
      </block>
      <view class="inputItems_itemBtns">
        <button
          class="login_btn"
          :form-type="item.type"
          v-for="(item, index) in form1.buttons"
          :key="index"
        >
          {{ item.name }}
        </button>
      </view>
    </form>
  </view>
</template>

<script>
  export default {
    props: {
      form: {
        type: Object,
        value: {}
      }
    },
    data() {
      return {
        setInter: null,
        form1: this.form,
        authtime: ''
      }
    },
    computed: {
      ...mapState(['user', 'loginInfor'])
    },
    methods: {
      ...mapMutations(['setLoginInfor']),
      //查看协议
      toDocument(type) {
        console.log('我要跳转as', type)
        if (type == 1) {
          uni.navigateTo({
            url: '/pages/public/agreement/serviceText'
          })
        } else {
          uni.navigateTo({
            url: '/pages/public/agreement/privacyText'
          })
        }
      },
      checkedbul(e) {
        //调用父组件的checkTab方法
        this.$parent.checkTab(e.detail.value.length)
      },
      //input等表单元素的双向绑定
      setModel(e, index) {
        this.form1.inputItems[index].value = e.detail.value
        if (this.form1.inputItems[index].nameEng == 'mobile') {
          //手机号在登录页 忘记密码页 设置密码页 三页共同使用
          // this.$store.state.login.mobile=e.detail.value
          this.setLoginInfor({ mobile: e.detail.value })
        }

        // console.log('12345e',this.form1.inputItems[index])
        // let item=this.form1.inputItems[index]
        // if(item.nameEng.includes('password')&&item.name.includes('新密码')){//设置新密码
        // 	let result=reg.test(item.value)
        // 	console.log('适配result',result)
        // }else{

        // }
      },
      // 获取手机验证码
      setInputFn(index) {
        let that = this
        if (this.form1.inputItems[index].name.includes('验证码')) {
          const telRule = /^1[3456789]\d{9}$/
          console.log('获取数据', this.form1)
          this.form1.inputItems.forEach((item) => {
            if (item.name.includes('手机号')) {
              if (!telRule.test(item.value)) {
                this.$toast('请输入正确的11位手机号')
              } else {
                this.$emit('getFetchVcode', { mobile: item.value })
                that.$api.getFetchVcode({ mobile: item.value }, function (res) {
                  console.log('获取数据2', res.code)
                  if (res.code == 0) {
                    that.authtime = '59'
                    that.setInter = setInterval(function () {
                      that.authtime--
                      if (that.authtime <= 0 || that.setInter == null) {
                        that.authtime = ''
                        console.log('获取按钮的值', that.form1.inputItems[index].button)
                        that.form1.inputItems[index].button = '重新获取验证码'
                        clearInterval(that.setInter)
                      }
                    }, 1000)
                  }
                })
              }
            }
          })
        } else if (this.form1.inputItems[index].name.includes('密码')) {
          //密码 跳转忘记密码
          this.$emit('doForgetPsd')
        }
      },
      setSubmitFun(e) {
        /**
         * 1,验证表单
         *2,调用父级定义方法
         */
        //首字母 字母+数字+下划线 长度8-20（包含）

        let reg = /^[a-zA-Z]\w{7,19}$/
        console.log('form发生了submit事件，携带数据为1：' + JSON.stringify(e.detail.value))
        let formOb = e.detail.value
        let telRule = /^1[3456789]\d{9}$/
        let keyArr = Object.keys(formOb)
        // ||!telRule.test(formOb.mobile)
        if (keyArr.includes('mobile') && (formOb.mobile == '' || !telRule.test(formOb.mobile))) {
          this.$toast('请输入正确的11位手机号')
        } else if (keyArr.includes('vcode') && formOb.vcode == '') {
          this.$toast('请输入手机验证码')
        } else if (keyArr.includes('protocol') && formOb.protocol.length <= 0) {
          this.$toast('请先阅读并同意以上条款')
        } else if (keyArr.includes('password') && formOb.password == '') {
          if (
            this.form1.inputItems[1] &&
            this.form1.inputItems[1].placeholder.includes('请输入密码')
          ) {
            this.$toast('密码不能为空')
          } else {
            if (!reg.test(formOb.password)) {
              this.$toast('请输入8-20位字母+数字+下划线新密码 且只能以首字母开头')
            }
          }
        } else {
          console.log('均不为空' + JSON.stringify(e.detail.value))
          this.$emit('setSubmit', formOb)
        }
      }
    }
  }
</script>

<style lang="scss">
  .langInput {
    width: 420rpx !important;
  }
  .name_label {
    display: inline-block;
    width: 100rpx;
    text-align: left;
  }
  .imageWei {
    width: 48rpx;
    height: 48rpx;
    vertical-align: middle;
    background: fixed;
  }
  /* form begin */
  .inputItems {
    &_item {
      border-bottom: 1px solid #b7c4cb;
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
        margin-top: 50rpx;
      }
      &_checkbox {
      }
      &_btn {
        font-size: 24rpx;
        color: #418acf;
      }
    }
    &_itemBtns {
      margin-top: 45rpx;
      button {
        background: $uni-text-color-inverse;
        border-radius: 100rpx;
        color: #fff;
      }
    }
  }
  /* form over */
</style>
