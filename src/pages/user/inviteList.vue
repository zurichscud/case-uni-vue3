<template>
	<view class="inviteList">
		<view class="titleList felx_all">
			<view @click="titleBtn(item)" class="fontlist" :class="activeIndex==item.value?'active':''"
				v-for="(item,i) in remackList" :key="i">
				<text class="text">{{item.name}}({{item.nums}}{{item.Company}})</text>
			</view>
		</view>
		<view class="btn_before">
			<u-button type="primary" @click="navTo">查看往期邀请记录</u-button>
		</view>
		<scroll-view scroll-y="true" class="scrollY" @scrolltolower="scrollbtm">
			<view v-if="!!user&&dataList.length==0" class="">
				<none name="暂无~"></none>
			</view>
			<view class="" v-if="activeIndex!=2">
				<view class="margHight" v-for="(item,i) in dataList" :key="i">
					<invitepersonal :item='item'></invitepersonal>
				</view>
			</view>
			<view class="" v-else>
				<view class="margHight" v-for="(item,i) in dataList" :key="i">
					<teaminvite :item='item'></teaminvite>
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import invitepersonal from "./components/invitepersonal.vue"
	import teaminvite from "./components/teaminvite.vue"
	export default {
		data() {
			return {
				remackList: [],
				activeIndex: 0, //当前索引
				paging: {
					pageSize: 20,
					pageNum: 1
				},
				dataList: [],
				count: 0
			}
		},
		components: {
			invitepersonal,
			teaminvite
		},
		computed: {
			...mapState(['user'])
		},
		onShow() {

		},
		onLoad() {
			if (this.user.remark == 6) {
				this.remackList = [{
					name: '全部',
					value: 0,
					Company: '人'
				}, {
					name: '顾问',
					value: 1,
					Company: '人'
				}, {
					name: '其他',
					value: 3,
					Company: '人'
				}]
			} else {
				this.remackList = [{
					name: '全部',
					value: 0,
					Company: '人'
				}, {
					name: '顾问',
					value: 1,
					Company: '人'
				}, {
					name: '社员团队',
					value: 2,
					Company: '个'
				}, {
					name: '其他',
					value: 3,
					Company: '人'
				}]
			}
			this.fetchData()
		},
		methods: {
			navTo() {
				uni.navigateTo({
					url: "/pages/invite/record"
				})
			},
			// 高亮改变
			titleBtn(item) {
				this.dataList = []
				this.activeIndex = item.value
				this.paging.pageNum = 1
				if (this.activeIndex == 0) {
					this.fetchData()
				} else {
					this.activeData()
				}

			},
			scrollbtm() {

				this.paging.pageNum++
				if (this.activeIndex == 0) {
					if (this.count > this.dataList.length) {
						this.fetchData()
					}
				} else {
					if (this.count > this.dataList.length) {
						this.activeData()
					}

				}
			},
			async fetchData() {
				let {
					data
				} = await this.$api.newInviteRecord({
					userId: this.user.id,
					...this.paging
				})
				if (this.user.id) {
					this.count = data.count
					this.remackList = this.remackList.map((el, i) => {
						if (el.value == 0) {
							el.nums = data.allPersonNumber
							return el
						} else if (el.value == 1) {
							el.nums = data.baoMinNumber
							return el
						} else if (el.value == 2) {
							el.nums = data.memberNumber
							return el
						} else if (el.value == 3) {
							el.nums = data.otherNumber
							return el
						}
					})

				} else {

				}
				if (!!data.inviteAllRecordVos) {
					this.dataList.push(...data.inviteAllRecordVos)
				}
			},
			async activeData() {
				let res = await this.$api.newInviteRecord(Object.assign({
					userId: this.user.id,
					type: this.activeIndex
				}, this.paging))
				this.count = res.data.count
				this.dataList.push(...res.data.inviteRecords)
			}

		}
	}
</script>

<style lang="scss">
	.felx_all {
		display: flex;
		justify-content: space-between;
	}

	.inviteList {

		.scrollY {
			padding: 0rpx 24rpx;
			// background-color: gray;
			width: 100%;
			height: 85vh;
			box-sizing: border-box;

			.margHight {
				margin-top: 20rpx;
			}
		}

		.titleList {
			height: 114rpx;
			line-height: 114rpx;
			padding: 0 44rpx;

			.fontlist {
				.text {
					font-size: 24rpx;
					color: #999999;
					text-align: center;
				}
			}

			.active {
				.text {
					font-size: 28rpx;
					color: #3F9CFF;
					transform: scale(1.2);
				}

			}
		}
	}

	.btn_before {
		position: sticky;
		top: 114rpx;
		left: 0;
		width: 100%;
	}
</style>