<template>
	<u-popup :show="show" mode="bottom" round="15" :closeable="true" @close="close" bgColor="#f3f3f3">
		<view class="popup-main" :style="{maxHeight: popupMaxHeight}">
			<view class="header">
				<text>谢谢你的反馈，我们会继续优化进步</text>
			</view>
			<view class="form">
				<view class="form-item">
					<view class="label">
						针对问题
					</view>
					<view class="value-box">
						<view class="item" @click="toggleSelection(item.dictLabel , 'targetQuestion')"
							:class="{active: targetQuestion.includes(item.dictLabel)}"
							v-for="item in feedbackObj.targetQuestion" :key="item.dictLabel">
							{{item.dictLabel}}
						</view>
					</view>
				</view>
				<view class="form-item">
					<view class="label">
						针对回答
					</view>
					<view class="value-box">
						<view class="item" @click="toggleSelection(item.dictLabel , 'targetAnswer')"
							:class="{active: targetAnswer.includes(item.dictLabel)}"
							v-for="item in feedbackObj.targetAnswer" :key="item.dictLabel">
							{{item.dictLabel}}
						</view>
					</view>
				</view>
				<view class="form-item">
					<view class="label">
						针对格式
					</view>
					<view class="value-box">
						<view class="item" @click="toggleSelection(item.dictLabel , 'targetFormat')"
							:class="{active: targetFormat.includes(item.dictLabel)}"
							v-for="item in feedbackObj.targetFormat" :key="item.dictLabel">
							{{item.dictLabel}}
						</view>
					</view>
				</view>
				<view class="form-item">
					<view class="label">
						我要补充
					</view>
					<view class="text-box">
						<textarea placeholder-style="color: #c2c2c2" cols="30" placeholder="请写下更多反馈内容" rows="2"
							v-model="supplement"></textarea>
					</view>
				</view>
				<view class="summit" @click="summit">提交</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'MsgFeedback',
		data() {
			return {
				show: false,
				menuButtonInfo: null,
				popupMaxHeight: 0,
				feedbackObj: {},
				targetQuestion: [],
				targetAnswer: [],
				targetFormat: [],
				supplement: ''
			}
		},
		mounted() {
			this.getQuestionList()
			// 获取胶囊位置信息
			this.menuButtonInfo = wx.getMenuButtonBoundingClientRect()
			// 计算最大高度（窗口高度 - 胶囊底部位置 - 安全边距）
			const systemInfo = wx.getSystemInfoSync()
			this.popupMaxHeight = `${systemInfo.windowHeight - this.menuButtonInfo.bottom - 20}px`
		},
		methods: {
			async getQuestionList() {
				const {
					data
				} = await this.$api.getQuestionList({
					dictType: 'ai_question_feedback'
				})
				this.feedbackObj = data || {}

			},
			toggleSelection(value, arrName) {
				const index = this[arrName].findIndex(item => item === value)
				if (index > -1) {
					this[arrName].splice(index, 1)
				} else {
					this[arrName].push(value)
				}
			},
			reset() {
				this.targetQuestion = [],
					this.targetAnswer = [],
					this.targetFormat = [],
					this.supplement = ''
				this.question = ''
			},
			verification() {
				if (!this.targetAnswer.length && !this.targetQuestion.length && !this.targetFormat.length && !this
					.supplement) {
					uni.showToast({
						title: '请至少选择一些问题',
						icon: 'none'
					})
					return true
				}
				return false
			},
			async summit() {
				console.log(this.verification())
				if (this.verification()) return
				const data = {
					userId: this.$store.state.user.id,
					question: this.question,
					targetQuestion: this.targetQuestion.join(','),
					targetAnswer: this.targetAnswer.join(','),
					targetFormat: this.targetFormat.join(','),
					supplement: this.supplement
				}
				await this.$api.addQuestion(data)
				this.reset()
				uni.showToast({
					title: '谢谢您的反馈',
					icon: 'none'
				})
				this.show = false
			},
			open(msg) {
				console.log(msg)
				this.question = msg
				this.show = true
			},
			close() {
				this.show = false
			}
		}
	}
</script>

<style lang="less">
	.popup-main {
		overflow-y: scroll;
	}

	.header {
		height: 115rpx;
		font-weight: 700;
		font-size: 30rpx;
		line-height: 115rpx;
		border-bottom: 2rpx solid #e7e7e7;
		padding: 0 26rpx;
	}

	.form {
		padding: 0 26rpx;

		.form-item {
			margin-top: 25rpx;
		}

		.label {
			font-size: 30rpx;
			line-height: 70rpx;
			height: 70rpx;
			font-weight: 700;
		}

		.value-box {
			display: flex;
			align-items: flex-start;
			flex-wrap: wrap;
		}

		.text-box {
			textarea {
				width: 100%;
				height: 168rpx;
				padding: 15rpx 30rpx;
				background-color: #fefefe;
				border-radius: 15rpx;
			}
		}

		.item {
			height: 75rpx;
			line-height: 75rpx;
			padding: 0 40rpx;
			background-color: #dedede;
			border-radius: 20rpx;
			text-align: center;
			margin: 0 20rpx 20rpx 0;
		}

		.active {
			background-color: #1a1a1a;
			color: #fff;
		}

		.summit {
			width: 100%;
			margin-top: 30rpx;
			background-image: linear-gradient(to right, #9fe7bf, #b1e4f1);
			color: #f4fffe;
			text-align: center;
			line-height: 100rpx;
			height: 100rpx;
			font-size: 26rpx;
			margin-bottom: 30rpx;
			border-radius: 15rpx;
			border: none;
		}
	}
</style>