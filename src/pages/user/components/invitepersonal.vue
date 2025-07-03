<template>
	<view>
		<view class="box_block">
			<view class="flex_all" style="margin-bottom: 30rpx;">
				<view class="flex_start">
					<text style="font-size: 36rpx;white-space: nowrap;">{{item.nickName}}</text>
					<view class="timeStyle"
						:class="[item.remark=='6'?'remackBck':'',item.remark=='7'||item.remark=='8'?'remackBckV':'']">
						{{item.remark|getremark}}
					</view>
					<view class="teamStyle" v-if="item.remark==5">
						{{item.pidNickName?item.pidNickName:'本人'}}团队
					</view>
				</view>

			</view>
			<view class="flex_all magHigt"  v-if="!!item.pidNickName">
				<view class="lefttext">
				手机号
				</view>
				<view class="righttext">
				{{item.phone}}
				</view>
			</view>
			<view class="flex_all magHigt">
				<view class="lefttext">
				注册时间
				</view>
				<view class="righttext">
				{{item.registerTime}}
				</view>
			</view>

			<view class="flex_all magHigt" v-if="!!item.upgradeMemberTime&&item.remark>5">
				<view class="lefttext">
				晋升社员
				</view>
				<view class="righttext">
				{{item.upgradeMemberTime}}
				</view>
			</view>
			<view class="flex_all magHigt" v-if="item.remark>6&&item.upgradeLeaderTime">
				<view class="lefttext">
				晋升大队长
				</view>
				<view class="righttext">
				{{item.upgradeLeaderTime}}
				</view>
			</view>
			<view class="flex_all magHigt">
				<view class="lefttext textblue">
				签约案件数量 {{item.signCaseNumber}}
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed:{
		...mapState(['user'])
		},
		filters: {
			getremark(val) {
				if (val == '5') {
					return '顾问'
				} else if (val == '8'){
					return '大队长·公社理事'
				} else if (val == '6') {
					return '社员'
				} else {
					return '大队长'
				}
			}
		},
		props: ['item'],

	}
</script>

<style scoped lang="scss">
	.flex_all {
		display: flex;
		justify-content: space-between;
	}

	.flex_start {
		display: flex;
		justify-content: flex-start;
	}

	.box_block {
		width: 632rpx;
		// height: 218rpx;
		padding: 32rpx;
		background: #FFFFFF;
		box-shadow: 0px 3px 22px 0px rgba(0, 0, 0, 0.05);
		border-radius: 30rpx;

		.righttext{
			color: #999999;
			font-size: 28rpx;
		}
		.lefttext{
			font-size: 28rpx;
	color: #111111;
		}
			.textblue{
			color: #3F9CFF;
		}
		.magHigt{
			margin-top: 12rpx;
		}
	}

	.teamStyle {
		box-sizing: border-box;
		font-size: 24rpx;
		position: relative;
		left: 26rpx;
		border: 2rpx solid #3F9CFF;
		color: #3F9CFF;
		padding: 0 18rpx;
		height: 42rpx;
		top: 4rpx;
		line-height: 37rpx;
		text-align: center;
		border-radius: 50rpx;
	}

	.timeStyle {
		box-sizing: border-box;
		font-size: 24rpx;
		position: relative;
		left: 16rpx;
		background-image: linear-gradient(to right, #86bcff, #3f9cff);
		color: white;
	min-width: 100rpx;
		height: 42rpx;
		line-height: 42rpx;
		top: 4rpx;
		text-align: center;
		border-radius: 50rpx;

	}

	.remackBck {
		background-image: linear-gradient(to right, #3f9cff, #0051e3);
	}

	.remackBckV {
		background: linear-gradient(133deg, #FFD37E 0%, #FF9500 99%);
	}
</style>
