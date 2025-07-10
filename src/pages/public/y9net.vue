<!-- 官网首页 -->
<template>
	<web-view  src="https://www.y9net.cn"></web-view>
</template>
<script>
	export default {
	}
</script>

<style lang="scss" scoped>
	body{
		height: 100%;
		overflow: hidden;
	}
	::-webkit-scrollbar{
		height: 0;
		width: 0;
	}
</style>

<route lang="json">
{
  "name": "y9net",
  "style": {
    "navigationBarTitleText": "官网"
  }
}
</route>
