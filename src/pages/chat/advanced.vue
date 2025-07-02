<template>
	<view class="backimg" style="">
		<view class="title">
			<view class="title_text">
				理赔有纠纷
			</view>
			<view class="title_text">
				<text class="text_color">理赔公社</text>来帮忙
			</view>
		</view>

		<view class="pontion_abbtm">
			<view class="btm_text">
				人均20年以上理赔经验专家
			</view>
			<view class="btm_text">
				为客户提供专业服务
			</view>
		</view>
		<view class="pontion_btm">

			<view class="btm_btn submit" @click="pushNav">
				开始提交
			</view>
			<view class="btm_btn invitation" @click="invitation">
				邀请客户提交案件
			</view>
			<button plain="true" open-type="share" class="item ">
			</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import * as MessageAPI from '@/apis/message'
	export default {
		data() {
			return {
				caseId: ''
			}
		},
		onShareAppMessage(res) {
			return {
				title: '快来和我一起加入理赔公社吧!',
				path: `/pages/index/index?pid=${this?.user?.id}&userRemark=true`,
				imageUrl: 'https://app.y9net.cn/data/01/33/wKgBNmNrSeSAbR2TAAEp5UKyBy8155.png',
				success(res) {
					console.log('分享成功', res);
				}
			}
			
		},
		computed: {
			...mapState(['user'])
		},
		methods: {
			async pushNav() {
				// 直接跳到聊天
				// 给用户添加新案件
				let { data } = await this.$api.newAddCase(this.user.id)
				this.caseId = data
				// 填入默认聊天内容
				const res = await MessageAPI.getRobotMessage({type: 1})
				let masList = res.data.map((el) => {
					return {
						caseId: this.caseId,
						content: el.message,
						msgType: el.messageType,
						type: 3,
						userId: this.user.userId
					}
				})
				//聊天记录批量添加
				await this.$api.batchSave(masList)
				uni.navigateTo({
					url: `/pages/chat/chatroom?caseId=${this.caseId}&isNew=1`
				});
			},
		}

	}
</script>
<style scoped lang="scss">
	.backimg {
		width: 100%;
		height: 1624rpx;
		background-image: url("https://app.y9net.cn/data/01/38/wKgBNmPpr8OAJjttAAVPCNiY4W0360.png");
		background-repeat: no-repeat;
		background-size: cover;
		display: flow-root;
		position: relative;

		.title {
			margin-top: 46rpx;

			.title_text {
				text-align: center;
				font-family: Alibaba PuHuiTi 2.0-105 Heavy, Alibaba PuHuiTi 20;
				font-weight: 900;
				color: #1460FF;

				font-size: 72rpx;
				line-height: 100rpx;
				-webkit-background-clip: text;

				.text_color {
					color: #FFB200;
				}
			}
		}

		.pontion_abbtm {
			text-align: center;
			color: white;
			position: absolute;
			bottom: 330rpx;
			width: 100%;

			.btm_text {
				font-size: 32rpx;
				font-family: Alibaba PuHuiTi 2.0-65 Medium, Alibaba PuHuiTi 20;
				line-height: 22px;
			}
		}

		.pontion_btm {
			text-align: center;
			color: white;
			position: fixed;
			bottom: 60rpx;
			width: 100%;

			.btm_text {
				font-size: 32rpx;
				font-family: Alibaba PuHuiTi 2.0-65 Medium, Alibaba PuHuiTi 20;
				line-height: 22px;
			}

			.btm_btn {
				width: 580rpx;
				height: 88rpx;
				line-height: 84rpx;
				border-radius: 120rpx;
				box-sizing: border-box;
				margin: 32rpx auto;
			}

			.invitation {
				border: 2px solid white;
				background: rgb(20, 96, 255);
			}

			.submit {
				background-color: white;
				color: #1460FF;
				border: 2px solid #1460FF;
				border-radius: 120rpx;

			}

			.item {
				opacity: 0;
				position: absolute;
				width: 580rpx;
				height: 88rpx;
				line-height: 88rpx;
				border-radius: 120rpx;
				box-sizing: border-box;
				margin: 0 auto;
				left: 0;
				right: 0;
				bottom: 33rpx;
			}
		}

	}
</style>