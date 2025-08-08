<template>
  <web-view :webview-styles="webviewStyles" src="option.url"></web-view>
</template>

<script>
export default {
  data() {
    return {
      option: {},
      webviewStyles: {
        progress: {
          color: '',
        },
      },
    }
  },
  onLoad(option) {
    console.log('传递参数', option)
    this.option = option
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
