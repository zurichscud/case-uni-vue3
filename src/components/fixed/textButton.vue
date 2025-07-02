<template>
	<view>
		<view v-if="!loading" class="img_btn">
			<text @click="nav_(0)">{{text}}>></text>
			<v-kefu>
				<text slot="kefu">{{text1}}>></text>
			</v-kefu>
		</view>
	</view>
</template>

<script>
	import vKefu from "@/components/kefu"
	export default {
		data() {
			return {
				loading:true,
				user:this.$store.state.user,
				text:'付费咨询',
				text1:"免费咨询",
				hasCards:false//快速咨询是否有卡（案件测评是否有后三种卡） 没卡跳转addNewCards页面 有卡 正常购买
			};
		},
		props:{
			mediateMode:{
				type:Number,
				default:0
			}
		},
		components:{vKefu},
		created() {
			if(this.mediateMode){
				this.text="付费测评"
				this.text1="免费测评"
			}
			this.pageInit()
			console.log('haaaaaaaaaaa',this.text1)
		},
		methods:{
			async pageInit(){
				if(this.mediateMode==0||this.mediateMode==5){//快速咨询和案件测评
					let businessType=1
					if(this.mediateMode==0){
						businessType=1//快速咨询
					}else{
						businessType=9//案件测评是否有后三种卡
					}
					let res=await this.$api.selectCanUseCard({userId:this.user.id,businessType,})
					if(res.code==0){
						this.hasCards=res.datas.length>0?true:false
						this.loading=false//加载完成
						console.log('初始化this.hasCards:',this.hasCards)
					}
				}
			},
			async nav_(type){
				if(type==0){
					this.$store.state.mediateData.mediateMode=this.mediateMode
					console.log('点击this.hasCards:',this.hasCards)
					if(this.hasCards){//有卡
						// this.$Router.push({name:"expertConsultation",params:{type:1}})
					}else{//没卡
					// 
						// this.$Router.push({name:"addNewCards",params:{next:'expertConsultation'}})
					}
				}else{//跳转webView
					
				}
			}
		}
	}
</script>

<style lang="scss">
.img_btn{width: 184rpx;height:140rpx;position: fixed;bottom: 184rpx;right: 0;z-index: 22;background-color:transparent;}
.img_btn text{font-size: 24rpx;width: 184rpx;height: 60rpx;text-align: center;line-height: 60rpx;border-radius:40rpx;box-shadow:0px 1px 6px 0px rgba(0,0,0,0.15);display: block;}
.img_btn text:first-child{background-color: $uni-text-color-inverse;color: #FFFFFF;}
.img_btn text:last-child{background-color:#FFFFFF;color: $uni-text-color-inverse;margin-top: 20rpx;}
</style>
