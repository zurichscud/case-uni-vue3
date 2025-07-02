<template>
	<view>
		<view class="flex_all">
			<view v-for="(item,index) in list" :key="index">
<view class="btn" :class="activeIndex==index?'active':''" @click="btnIndex(index)">
	{{item.name}}
</view>
		</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data(){
		 return{
			  list:[
				{name:"全部",value:0},
				{name:"第一季度",value:1},
				{name:"第二季度",value:2},
				{name:"第三季度",value:3},
				{name:"第四季度",value:4}
			],//总数据
			activeIndex:0//当前高亮索引
		 }
		},
		methods:{
			// 点击触发事件
			btnIndex(index){
				this.activeIndex = index
			}
		}
		
	}
</script>

<style scoped lang="scss">
.flex_all{
	display: flex;
	justify-content: space-between;
	// 默认样式
	.btn{
		border: 1px solid gray;
		border-radius: 200px;
		padding: 3px 3px;
	}
	// 高亮样式
	.active{
		border: 1px solid blue;
		color: blue;
	}
}
</style>