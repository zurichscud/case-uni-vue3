<template>
  <!-- 弹窗容器 -->
  <view class="alert">
    <!-- 
      uni-popup: uni-app官方弹窗组件
      ref="popup": 组件引用，用于调用open/close方法
      :type: 弹窗显示类型，默认为center（居中显示），还可以是bottom、top等
      :mask-click: 点击遮罩层是否关闭弹窗，auto为true时不允许点击遮罩关闭
    -->
    <uni-popup ref="popup" :type="type || 'center'" :mask-click="auto ? false : true">
      <!-- 
        弹窗主体内容容器
        动态class说明：
        - type为空时添加borderR类（圆角边框）
        - 固定popup-content类（基础样式）
        - topheig为true时添加achei类（调整顶部位置）
      -->
      <view
        :class="[type ? '' : 'borderR', 'popup-content', topheig ? 'achei' : '']"
        style="position: relative">
        <!-- 主标题区域 - 只有传入title时才显示 -->
        <view v-if="title" class="title">{{ title || '温馨提示' }}</view>

        <!-- 右上角关闭按钮 - closex为true时隐藏 -->
        <view class="closeBtn" @click="close" v-if="!closex"> × </view>

        <!-- 副标题区域 - 只有传入title2时才显示 -->
        <view v-if="title2" class="title2">
          {{ title2 }}
        </view>

        <!-- 插槽：用于放置自定义内容 -->
        <slot></slot>

        <!-- 
          按钮区域 - 只有配置了按钮时才显示
          btn数组包含1时显示取消按钮，包含2时显示确定按钮
          当同时包含1和2时，使用flex_between_x类实现左右分布
        -->
        <view
          v-if="(btn && btn.includes(1)) || (btn && btn.includes(2))"
          :class="[btn && btn.includes(1) && btn.includes(2) ? 'flex_between_x' : '', 'btns']">
          <!-- 取消按钮 - 点击直接关闭弹窗 -->
          <view @click="$refs.popup.close()" v-if="btn && btn.includes(1)" class="flex_all">{{
            btnName1 ? btnName1 : '取消'
          }}</view>

          <!-- 确定按钮 - 点击触发submit方法 -->
          <view @click="submit" v-if="btn && btn.includes(2)" class="flex_all">{{
            btnName2 ? btnName2 : '确定'
          }}</view>
        </view>

        <!-- 条件编译：只在H5平台显示，为底部弹窗增加底部空间 -->
        <!-- #ifdef H5 -->
        <view v-if="type == 'bottom'" style="height: 100rpx"></view>
        <!-- #endif -->
      </view>
    </uni-popup>
  </view>
</template>

<script>
  // Props参数详细说明：
  // type: 弹窗类型（如 'center'居中, 'bottom'底部, 'top'顶部等）
  // title: 主标题文本，默认为 "温馨提示"
  // btn: 按钮配置数组（包含1表示显示取消按钮，包含2表示显示确定按钮）
  // btnName1: 自定义第一个按钮名称，默认为 "取消"
  // btnName2: 自定义第二个按钮名称，默认为 "确定"
  // auto: 是否自动关闭（影响点击遮罩是否关闭弹窗，true时点击遮罩不关闭）
  // title2: 副标题
  // topheig: 是否调整顶部高度（为true时弹窗位置上移）
  // closex: 是否隐藏关闭按钮（为true时隐藏右上角×按钮）

  export default {
    // 组件接收的所有props参数
    props: ['type', 'title', 'btn', 'btnName1', 'btnName2', 'auto', 'title2', 'topheig', 'closex'],

    // 组件内部数据
    data() {
      return {
        isOpen: false // 弹窗开启状态（目前未使用）
      }
    },

    // 页面加载时触发（在页面组件中使用时）
    onLoad(option) {
      console.log('传递参数', option)
      this.option = option // 保存传递的参数
    },

    // 页面初次渲染完成时触发
    onReady() {
      if (this.isOpen) {
        // 预留的逻辑，可以在这里处理初始打开状态
      }
    },

    // 组件方法
    methods: {
      /**
       * 打开弹窗
       * 通过ref调用uni-popup的open方法
       */
      open() {
        this.$refs.popup.open()
      },

      /**
       * 关闭弹窗
       * 通过ref调用uni-popup的close方法
       */
      close() {
        this.$refs.popup.close()
      },

      /**
       * 提交/确定按钮点击事件
       * 向父组件触发submit事件，父组件可以监听此事件处理业务逻辑
       */
      submit() {
        this.$emit('submit', {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  /* 右上角关闭按钮样式 */
  .closeBtn {
    font-size: 56rpx; /* 字体大小 */
    color: #999999; /* 字体颜色：灰色 */
    position: absolute; /* 绝对定位 */
    top: 10rpx; /* 距离顶部10rpx */
    right: 32rpx; /* 距离右边32rpx */
  }

  /* 调整顶部高度的样式类 */
  .achei {
    top: -130rpx !important; /* 向上偏移130rpx，用于特殊位置需求 */
  }

  /* 弹窗主体内容样式 */
  .popup-content {
    padding: 30rpx 40rpx; /* 内边距：上下30rpx，左右40rpx */
    text-align: center; /* 文本居中对齐 */
    background-color: #fff; /* 背景色：白色 */

    /* 主标题样式 */
    .title {
      font-weight: bold; /* 字体加粗 */
      font-size: 36rpx; /* 字体大小 */
      margin-bottom: 42rpx; /* 底部外边距 */
    }

    /* 按钮容器样式 */
    .btns {
      padding: 30rpx 56rpx 0 56rpx; /* 内边距：顶部30rpx，左右56rpx */
      text-align: center; /* 文本居中 */
    }

    /* 按钮通用样式 */
    .btns view {
      display: inline-block; /* 行内块元素，可以并排显示 */
      padding: 0 40rpx; /* 左右内边距40rpx */
      height: 64rpx; /* 按钮高度 */
      line-height: 64rpx; /* 行高等于高度，实现垂直居中 */
      background: #e2e2e2; /* 背景色：浅灰色（默认按钮） */
      border-radius: 20rpx; /* 圆角20rpx */
    }

    /* 最后一个按钮样式（通常是确定按钮） */
    .btns view:last-child {
      background: #3f9cff; /* 背景色：蓝色（高亮按钮） */
      color: #fff; /* 字体颜色：白色 */
    }
  }

  /* 副标题样式 */
  .title2 {
    margin-top: 40rpx; /* 顶部外边距 */
    margin-bottom: 20rpx; /* 底部外边距 */
    font-size: 52rpx; /* 字体大小：比主标题大 */
    font-weight: 600; /* 字体加粗程度 */
    text-align: left; /* 文本左对齐 */
  }

  /* 圆角边框样式类 */
  .borderR {
    border-radius: 20rpx; /* 圆角20rpx，用于居中弹窗 */
  }
</style>
