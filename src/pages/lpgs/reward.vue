<!-- 奖励策略 -->
<template>
  <view>
    <image
      lazy-load
      mode="widthFix"
      :src="
        user.remark == '7' || user.remark == '8'
          ? 'https://app.y9net.cn/data/01/38/wKgBNmPpoNuAEa-VAAVWwyPWFkE583.jpg'
          : 'https://app.y9net.cn/data/01/38/wKgBNmPpoLKAD18OAANSHqPedB4675.jpg'
      "
      alt=""
      style="width: 100%"
    ></image>
  </view>
</template>

<script>
  export default {
    data() {
      return {}
    },
    computed: { ...mapState(['user']) },
    created() {
      console.log(this.user.remark)
      console.log(this.user)
    }
  }
</script>

<style scoped lang="scss"></style>
