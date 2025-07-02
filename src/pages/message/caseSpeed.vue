<!-- 案件进度通知 -->
<template>
	<view class="">
		<view class="" v-if="dataList.length==0">
			<none name="暂无最新通知~"></none>
		</view>
		<view v-else class="box_padd">
			<view v-for="(item,index) in dataList" :key="index" class="for_blaock" @longtap="onLongPress(item.id)">
				<view class="sp_Top">
					<view class="sp_title">
						{{item.content}}
					</view>
					<view class="sp_time">
						{{item.gmtCreate}}
					</view>
				</view>
				<view class="sp_btm" @click="navTo(item.caseId)">
					<view class="sp_btm_lef">
						查看详情
					</view>
					<view class="sp_btm_right">
						<image src="../../static/right.png" mode="" style="width: 12rpx;height: 24rpx;"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				userInfo:{},
				dataList:[],
				pageNum:1
			}
		},
	async onLoad() {
			this.userInfo = uni.getStorageSync('user')
			this.getList()
		}
		,onReachBottom() {
			this.getList()
		}
		,methods:{
			onLongPress(Id){
				let that = this
					uni.showModal({    // 弹框询问是否进行下一步事件
					        title: '提示',
					        content: '是否删除该记录',
					        success: async function(res) {
					            if (res.confirm) {
					                console.log('用户点击确定');
								let {code} = await	that.$api.deletedStepMessage({
										id:Id
									})
									if(code==200){
										that.dataList.forEach((el,i)=>{
											if(el.id==Id){
												that.dataList.splice(i,1)
											}
										})
									}else{
										uni.showToast({
											duration:2000,
											title:'删除失败'
										})
									}
					             
					            } else if (res.cancel) {
					                console.log('用户点击取消');
					                return
					            }
					        }
					    });
				},
		async getList(){
			
		let res = await	this.$api.getCaseStatusMessage({userId:this.userInfo.id,
				category:1,
				isAsc:'desc',
				orderByColumn:'id',
				pageNum:this.pageNum,
				pageSize:20
				})
				if(res.total>this.dataList.length){
					this.dataList.push(...res.rows) 
					this.pageNum++
				}
				
			},
			navTo(caseId){
				uni.navigateTo({
					url: `/pages/chat/chatroom?caseId=${item.caseId}&userId=${this.value.id}`
				})
			}
		}
		
	}
</script>

<style scoped lang="scss">

	.box_padd{
		padding:0 32rpx;
		padding-bottom: 50rpx;
		.for_blaock{
	    margin-top: 24rpx;
	background-color: white;
	box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
	border-radius: 30rpx;
	color: #848484;
	text-align: left;
padding: 0 36rpx;

	.sp_btm_lef{
		font-size: 28rpx;
		color: #999999;
	}
	.sp_btm{
		padding: 20rpx 0;
		display: flex;
		width: 100%;
		justify-content: space-between;
		border-top: 2rpx solid #eeeeee;
	}
	.sp_title{
		color: #111111;
		font-size: 32rpx;
		font-weight: 600;
	}
	.sp_time{
		font-size: 24rpx;
		line-height: 60rpx;
	}
	.sp_Top{
		padding: 20rpx 0;
	}
}
	}

</style>