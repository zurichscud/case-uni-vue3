<!-- 门票核销 -->
<template>
	<view class="main">
		<view class="tab">
			<view :class="{item: true, active: active === item.value}" v-for="item in tabs" :key="item.value"
				@click="active = item.value">
				{{ item.label }}
			</view>
		</view>
		<view class="img" v-if="active === 0">
			<image src="@/static/doCode.png" mode="heightFix"></image>
		</view>
		<view class="input" v-else>
			<input placeholder="请输入门票号" v-model.trim="ticketsID"></input>
		</view>
		<view class="btn">
			<button @click="onVer">{{active === 0 ? '扫描二维码' : '点击核销'}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from "vuex"
	export default {
		data() {
			return {
				active: 0,
				tabs: [{
					label: '扫描二维码',
					value: 0
				}, {
					label: '手动输入',
					value: 1
				}],
				ticketsID: ''
			};
		},
		computed: {
			...mapState(['user'])
		},
		onShow() {
			this.ticketsID = ''
		},
		methods: {
			dsfs(e) {
				console.log(e)
			},
			async onVer() {
				if(this.active) {
					// 手动输入
					if(!this.ticketsID) {
						return uni.showToast({
							icon: 'none',
							title: '请输入票号'
						})
					}
					const { data } = await this.$api.verifyTicket(this.ticketsID, this.user.id)
					uni.navigateTo({
						url: `/pages/meeting/verResult?result=${data}&ticketsID=${this.ticketsID}`
					})
				}else {
					// 扫描二维码
					uni.scanCode({
						success: async (res) => {
							const ticketCode = res.result
							const { data } = await this.$api.verifyTicket(ticketCode, this.user.id)
							uni.navigateTo({
								url: `/pages/meeting/verResult?result=${data}&ticketsID=${ticketCode}`
							})
						},
						fail: function (res) {
							uni.showToast({
								icon: 'none',
								title: '扫描失败'
							})
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		justify-content: center;
		background-color: #f3f4f6;
		align-items: center;
	}

	.main {
		width: 700rpx;
		height: 1000rpx;
		background-color: #fff;
		padding: 20rpx;

		.img {
			margin: 50rpx 0;
			display: flex;
			justify-content: center;
			height: 500rpx;

			image {
				height: 500rpx;
			}
		}
		.input {
			padding: 50rpx 0;
			input {
				border-radius: 12rpx;
				padding: 0 14rpx;
				border: 1px solid #e4e4e7;
				height: 90rpx;
			}
		}

		.btn {
			button {
				background: linear-gradient(134deg, #F8FAFF 0%, #78B9FD 0%, #644dff 100%);
				border-radius: 12rpx;
				color: #fff;
			}
		}
	}

	.tab {
		padding: 10rpx;
		height: 90rpx;
		background-color: #f4f4f5;
		border-radius: 12rpx;
		display: flex;
		margin-bottom: 20rpx;
		box-sizing: border-box;

		.item {
			width: 50%;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
			color: #649e9e;
		}

		.active {
			background-color: #fff;
			border-radius: 12rpx;
			box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, .12), 0 0 6rpx rgba(0, 0, 0, .04);
			color: #18181b;
		}
	}
</style>