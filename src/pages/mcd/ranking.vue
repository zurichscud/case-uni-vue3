<template>
	<view class=" ">
		<view class=" p-s" style="top: 0;">
		<u-notice-bar  v-if="text1" bgColor='#55aaFF' color='#FFFFFF' :text="text1"></u-notice-bar>
		</view>
		<view class="px-30">
		<!-- <button v-on:click="shuffle">Shuffle</button> -->
		<view class="" ref='domBlock'>
			<view v-for="(item,index) in dataList"  v-bind:key="item.id">
				<transition name="list-fade" mode="out-in">
				        <view class="flex_between bt-e py-30">
							<view class="flex_start">
								<!-- <view class="font_bold mr-10 fz_36">
									{{index+1}}
								</view> -->
								<image  v-if="index<3" :src="imageSrc(index)" class="image_ranking_style mr-10"></image>
								<text v-else  class="mr-10 font_bold image_ranking_style text_center">
									{{index+1}}
								</text>
								<image :src="item.photo" class="image_style mr-10"></image>
								<view>
									{{item.userName}}
								</view>
							</view>
							<view class="">
								点赞数量：<text class="font_bold">{{item.likeNumber}}</text>
							</view>
							
						</view>
				      </transition>
			</view> </view>
		</view>
	</view>
</template>

<script>
	import _ from "lodash-es"
	export default {
		data() {
			return {
				text1: '',
				dataList: [],
				options:{},
				times:null
			}
		},
		onLoad(options) {
			this.options = options
			this.getDynamicEntries()
			this.feachInit()
	this.times =  setInterval(()=>{
			 this.feachInit()
		},8000)
		},
		beforeDestroy() {
			clearInterval(this.times)
		},
		methods: {
			imageSrc(index){
				if(index===0){
					return '../../static/jinpai.png'
				}else if(index===1){
					return "../../static/yinpai.png"
				}else{
					return "../../static/tongpai.png"
				}
				
			},
			init(){
			// this.$refs.domBlock.getBoundingClientRect()	
			
			},
			shuffle: function() {
				
			// this.scheduleAnimation(()=>{
				this.dataList = _.shuffle(this.dataList)
			// })
			},
			async getDynamicEntries(){
		 let res = 	await this.$api.getDynamicEntries(this.options.id )	
		if(res.code==200){
			this.text1 = res.msg
		}
			},
			async feachInit() {
				let res = await this.$api.getGameCommentList("?pageNum=1&pageSize=3000", {
					gameCaseId: this.options.id,
					identityId: 0
				})
				if (res.code === 200) {
					this.dataList = res.rows
				}
			},
			scheduleAnimation(update) {
			  // 获取旧图片的位置
			  const prevImgs = this.$refs.domBlock.slice()
			  const prevSrcRectMap = createSrcRectMap(prevImgs)
			  // 更新数据
			  update()
			  // DOM更新后
			  this.$nextTick(() => {
			    const currentSrcRectMap = createSrcRectMap(prevImgs)
			    Object.keys(prevSrcRectMap).forEach((src) => {
			      const currentRect = currentSrcRectMap[src]
			      const prevRect = prevSrcRectMap[src]
			
			      const invert = {
			        left: prevRect.left - currentRect.left,
			        top: prevRect.top - currentRect.top,
			      }
			
			      const keyframes = [
			        {
			          transform: `translate(${invert.left}px, ${invert.top}px)`,
			        },
			        { transform: "" },
			      ]
			      const options = {
			        duration: 300,
			        easing: "cubic-bezier(0,0,0.32,1)",
			      }
			
			      const animation = currentRect.img.animate(keyframes, options)
			    })
			  })
			}
		}
	}
</script>

<style scoped lang="scss">
	.image_style{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.image_ranking_style{
		width: 50rpx;
		height: 50rpx;
	}
.list-fade-enter-active {
  transition: all 0.5s;
}
.list-fade-leave-active {
  transition: all 0.5s;
}
.list-fade-enter, .list-fade-leave-to {
  opacity: 0;
}
</style>