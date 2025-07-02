<template>
  <view>
    <checkbox-group @change="onAgreementChange">
      <view>
        <checkbox value="agreed" :checked="isAgreed" />
        我已阅读并同意
        <text class="inputItems_item_btn" @click="toDocument(1)">《服务协议》</text>和
        <text class="inputItems_item_btn" @click="toDocument(2)">《隐私政策》</text>
      </view>
    </checkbox-group>
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
        isAgreed: false
      }
    },
    methods: {
      //查看协议
      toDocument(type) {
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
      onAgreementChange(e) {
        this.isAgreed = e.detail.value.includes('agreed')
      }
    }
  }
</script>

<style lang="scss"></style>
