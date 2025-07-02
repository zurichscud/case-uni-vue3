<template>
	<view>
		<view v-if="dataList.length==0" class="">
					<none name="暂无记录"></none>
				</view>
<view class="" v-for="(item,i) in dataList" :key="i">
	<view class="titleTime" >
		{{item.startTime | timeday}}
	</view>
	<view class="main" v-for="(n,index) in item.meetingListVos" :key="index" @click="navTo(n.id)">
		<view class="main_flex">
			<view class="">
				<image :src="n.expertURL" mode="" class="main_image"></image>
			</view>
			<view class="main_right">
				<view class="main_right_flex">
					<view class="main_right_flex_case">
					案件编号{{n.caseId}}
					</view>
					<view class="main_right_flex_statu">
						{{n.meetingStatus | statusfilter}}
					</view>
				</view>
				<view class="main_right_flex">
					<view class="main_right_flex_expert">
						{{n.expertName}}
					</view>
					<view class="main_right_flex_time">
						{{n.startTime | timesday}}
					</view>
				</view>
			</view>
		</view>
	</view>
</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
		import {
			mapState,
			mapMutations
		} from "vuex"
	export default {
		data(){
		return{
			dataList:[]
		}
		},
		filters:{
			timeday(val){ 
				let datatime = dayjs(val).format('MM月DD日')
			 return	datatime
			},
			timesday(val){
				let datatime = dayjs(val).format('HH:mm')
			 return	datatime
			},
			statusfilter(val){
				if(val==1){
					return '待接受'
				}else if(val==2){
					return "已接受"
				}else if(val==3){
					return "已完成"
				}else if(val==4){
					return "已拒绝"
				}else if(val==5){
					return "爽约"
				}
			}
		},
		computed:{
		...mapState(['user'])	
		},
		onLoad(options){
		
		}
		,
		created() {
	
		},
		onShow() {
				this.fetchList()	
		},
		methods:{
			navTo(id){
				uni.navigateTo({
					url: `/pages/meeting/detail?id=${id}`,
				})
			},
		async	fetchList(){
			let res =  await this.$api.getMeetingList({userId:this.user.id})
		this.dataList = res.data	
			}
		}
		
	}
</script>

<style scoped lang="scss">
.titleTime{
	background-color: #f9f9f9;
	height: 72rpx;
	line-height: 72rpx;
	padding: 0 42rpx;
}
.main{
	padding:20rpx 42rpx;
	background-color: white;
.main_flex{
	display: flex;
	justify-content: flex-start;
	.main_image{
		width: 102rpx;
		height: 102rpx;
		border-radius: 14rpx;
	}
	.main_right{
    flex-grow: 1;
			margin-left: 20rpx;
			.main_right_flex{
				display: flex;
				justify-content: space-between;
				margin: 7rpx 0;
				.main_right_flex_case{
					font-size: 36rpx;
				
				}
				.main_right_flex_time{
					font-size: 28rpx;
					color: #b3b3b3;
				}
				.main_right_flex_expert{
					font-size: 28rpx;
				}
				.main_right_flex_statu{
					font-size: 28rpx;
					color: #808080;
				}
			}
	}
}	
}
</style>