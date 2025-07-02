<template>
	<view v-if="show" class="dm-mask" :style="[wrapStyles]" @tap="onClick">
		<icon type="clear" size="26" class="close-icon" :style="[closeStyles]" v-if="closable" @tap.stop="close"></icon>
		<view :style="[contentStyles]">
			<slot />
		</view>
	</view>
</template>
<script>
	/**
	 * Mask 蒙版
	 * @description 视图蒙版组件 用于浮动层信息展示 默认背景为黑色透明度50%
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=dm-mask
	 * @property {Boolean} show 是否显示--默认false不显示，true显示；需要使用.sync双向绑定
	 * @property {String} width 宽度--默认值100%
	 * @property {String} height 高度--默认值100%
	 * @property {String} background-color 背景色--默认值'rgba(0, 0, 0, 0.5)'
	 * @property {String} z-index 元素的堆叠顺序--默认值 99
	 * @property {Object} custom-style 自定义 Mask 样式，样式对象语法
	 * @property {Boolean} closable 是否显示关闭按钮--默认值false不显示
	 * @event {Function} click 点击 Mask 触发事件
	 * @example <dm-mask :show.sync="false"></dm-mask>
	 */
	export default {
		name: 'DmMask',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: '100%'
			},
			backgroundColor: {
				type: String,
				default: 'rgba(0, 0, 0, 0.5)'
			},
			zIndex: {
				type: Number,
				default: 99
			},
			customStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			closable: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {}
		},
		methods: {
			getSysInfo() {
				return uni.getSystemInfoSync()
			},
			onClick() {
				this.$emit('on-click')
			},
			close() {
				this.$emit('update:show', false)
			}
		},
		computed: {
			closeStyles() {
				return {
					zIndex: this.zIndex + 1,
					// #ifdef APP-PLUS||APP-NVUE||MP-WEIXIN
					marginTop: 0
					// #endif
					// #ifndef APP-PLUS||APP-NVUE||MP-WEIXIN
					marginTop: this.zIndex < 998 ?
						`${(this.getSysInfo().statusBarHeight + this.getSysInfo().windowTop + 8)}px` : '8px'
					// #endif
				}
			},
			contentStyles() {
				return {
					zIndex: this.zIndex + 1,
					marginTop: this.zIndex < 998 ?
						`${(this.getSysInfo().statusBarHeight + this.getSysInfo().windowTop)}px` : 0
				}
			},
			wrapStyles() {
				let style = {};
				style.width = this.width;
				style.height = this.height;
				style.backgroundColor = this.backgroundColor;
				style.zIndex = this.zIndex;
				Object.assign(style, this.customStyle)
				return style
			}
		}
	}
</script>
<style lang="scss" scoped>
	.dm-mask {
		display: block;
		position: fixed;
		/* #ifdef APP-PLUS||APP-NVUE||MP-WEIXIN */
		top: 0;
		/* #endif */
		/* #ifndef APP-PLUS||APP-NVUE||MP-WEIXIN */
		top: var(--status-bar-height);
		/* #endif */
		left: 0;

		.close-icon {
			position: absolute;
			/* #ifdef APP-PLUS||APP-NVUE||MP-WEIXIN */
			top: 8px;
			/* #endif */
			/* #ifndef APP-PLUS||APP-NVUE||MP-WEIXIN */
			top: var(--status-bar-height);
			/* #endif */
			right: 8px;
			cursor: pointer;
		}
	}
</style>
