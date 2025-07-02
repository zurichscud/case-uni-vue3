<template>
	<view class="form-item">
		<view class="form-file-upload">
			<!-- 上传 -->
			<view class="panel" v-for="(item,index) in list" :key="index" :style="{
					height: `${height}px`,
					width: `${height}px`
				}">
				<!-- 移除按钮 -->
				<img @tap="removeFile(index)" class="close" src="../../static/delete.png" />

				<!-- 图片显示 -->
				<img v-if="item.is_img" class="img-show" :src="item.path" @tap="previewImage(item.path)" alt="文件加载失败" />
				<!-- 视频显示第一帧 -->
				<!-- #ifdef H5 -->
				<img v-else-if="item.is_video" class="img-show" :src="item.video_cover"
					@tap="previewFile(item.success_path)" alt="视频封面加载失败" />
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<img v-else-if="item.is_video" class="img-show" :src="item.video_cover" :style="{
						'border-radius':`${radius}px`
					}" @tap="previewFile(item.success_path)" alt="视频封面加载失败" />
				<!-- #endif -->
				<!-- 文件显示 -->
				<view v-else class="img-name" @tap="previewFile(item.success_path)">
					<img class="img" src="../../static/file.png" />
					<text class="text-two-line">{{item.type}}</text>
				</view>

				<!-- 待上传，正在上传，上传失败 -->
				<view v-if="item.status!=2" class="upload-loading">
					<!-- 上传进度 -->
					<text v-if="item.status==1">{{progress}}%</text>
					<!-- 上传错误 -->
					<img v-if="item.status==3" src="../../static/error.png" />
				</view>
			</view>
			<!-- 上传按钮 -->
			<view v-if="list.length<maxFile&&!disabled" @tap.stop="chooseFile" class="slot-box" :style="{
					height: `${height}px`,
					width: `${height}px`
				}">
				<slot>
					<view class="upload-btn">
						<img src="../../static/upload.png" />
					</view>
				</slot>
			</view>
		</view>

		<!-- 视频预览 -->
		<view v-if="is_preview_video" class="preview-video" @touchmove.stop.prevent="()=>{}">
			<text class="close" @tap="hidePreviewVideo">关闭</text>
			<video class="video" :src="preview_video_src">
			</video>
		</view>

		<!-- 临时视频组件 -->
		<video id="tmp-video" ref="tmp-video" v-show="false" :src="tmp_video_src"></video>
	</view>
</template>

<script>
	export default {
		name: 'form-file-upload',
		props: {
			maxFile: { // 最大文件数
				type: Number,
				default: 1
			},
			disabled: { // 是否禁用
				type: Boolean,
				default: false
			},
			height: { // 宽度和高度
				type: Number,
				default: 50
			},
			action: { // 请求url
				type: String,
				default: ''
			},
			headers: { // 请求头
				type: Object,
				default: () => {}
			},
			name: { // 上传 的key 
				type: String,
				default: 'file'
			},
			timeout: { // 超时时间 ms
				type: Number,
				default: 1 * 60 * 1000
			},
			formData: { // 表单其他参数
				type: Object,
				default: () => {}
			},
			// 事件
			onTimeout: { // 超时事件
				type: Function,
				default: () => function() {}
			},
			onProgress: { // 上传进度
				type: Function,
				default: () => function() {}
			},
			onError: { // 上传错误
				type: Function,
				default: () => function() {}
			},

			// 回调
			// @success
			// slot(插槽)
			// #default
		},
		data() {
			return {
				list: [
					// {
					// 	status: 0, // 0待上传 1正在上传 2上传成功 3上传失败
					// 	success_path: '', // 上传成功文件
					// 	is_img: false, // 是否是图片 true是 false否
					// 	is_video: false, // 是否是视频 true是 false否
					// path: '', // 待上传显示的文件
					// type: '', // 文件类型
					// video_cover: '', // 封面
					// 	...item, // path: 待上传显示的文件 type:文件类型
					// }
				], // 已上传列表
				upload_index: 0, // 当前上传的文件索引
				progress: 0, // 上传进度
				is_preview_video: false, // 是否预览视频
				preview_video_src: '', // 视频预览的路径
				h5_preview_file_src: '', // h5 文件预览路径
				tmp_video_src: '', // 临时视频组件路径
			}
		},
		methods: {
			// 选择图片上传
			chooseFile() {
				const _this = this
				let list_tmp = [] // 临时存放需要上传的文件列表
				
				if(!this.action) {
					let title = '请绑定上传路径'
					console.error(title)
					return
				}

				// #ifdef H5
				uni.chooseFile({
					count: this.maxFile,
					success(e) {
						// 提取文件列表
						for (let i = 0; i < e.tempFilePaths.length; i++) {
							list_tmp.push({
								status: 0, // 0待上传 1正在上传 2上传成功 3上传失败
								success_path: '', // 上传成功文件
								is_img: _this.jugdePictrue(e.tempFiles[i].type), // 是否是图片 true是 false否
								is_video: _this.jugdeVideo(e.tempFiles[i].type), // 是否是视频 true是 false否
								path: e.tempFilePaths[i],
								type: e.tempFiles[i].type,
								file: e.tempFiles[i]
							})
						}
						_this.execFile(list_tmp)
					}
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.showActionSheet({
					itemList: ['图片', '视频', '文件'],
					success(e) {
						let index = e.tapIndex
						switch (index) {
							case 0: // 图片
								_this.mpChooseImg()
								break
							case 1: // 视频
								_this.mpChooseVideo()
								break
							case 2: // 文件
								_this.mpChooseFile()
								break
						}
					}
				})
				// #endif
			},
			// 小程序选择图片
			mpChooseImg() {
				const _this = this
				let list_tmp = [] // 临时存放需要上传的文件列表
				uni.chooseImage({
					success(e) {
						// 提取文件列表
						e.tempFiles.forEach(item => {
							list_tmp.push({
								status: 0, // 0待上传 1正在上传 2上传成功 3上传失败
								success_path: '', // 上传成功文件
								is_img: true, // 是否是图片 true是 false否
								is_video: false, // 是否是视频 true是 false否
								path: item.path,
								type: 'image',
								// ...item, // path: 待上传显示的文件 type:文件类型
							})
						})
						_this.execFile(list_tmp)
					}
				})
			},
			// 小程序选择视频
			mpChooseVideo() {
				const _this = this
				let list_tmp = [] // 临时存放需要上传的文件列表
				uni.chooseVideo({
					success(e) {
						list_tmp.push({
							status: 0, // 0待上传 1正在上传 2上传成功 3上传失败
							success_path: '', // 上传成功文件
							is_img: false, // 是否是图片 true是 false否
							is_video: true, // 是否是视频 true是 false否
							path: e.tempFilePath,
							type: 'video',
							video_cover: e.thumbTempFilePath,
						})
						_this.execFile(list_tmp)
					}
				})
			},
			// 小程序选择文件
			mpChooseFile() {
				const _this = this
				let list_tmp = [] // 临时存放需要上传的文件列表
				wx.chooseMessageFile({
					count: this.maxFile,
					success: async function(e) {
						// 提取文件列表
						e.tempFiles.forEach(item => {
							list_tmp.push({
								status: 0, // 0待上传 1正在上传 2上传成功 3上传失败
								success_path: '', // 上传成功文件
								is_img: _this.jugdePictrue(item.type), // 是否是图片 true是 false否
								is_video: _this.jugdeVideo(item.type), // 是否是视频 true是 false否
								...item, // path: 待上传显示的文件 type:文件类型
							})
						})
						_this.execFile(list_tmp)
					}
				})
			},
			// 处理选择的文件并上传
			async execFile(list_tmp) {
				// 判断已上传文件是否小于最大可传文件数，大则截取
				if (this.list.length + list_tmp.length > this.maxFile) {
					let max_len = this.list.length - list_tmp.length
					list_tmp = list_tmp.slice(0, max_len - 1)
				}

				// 上传文件
				this.list = [...this.list, ...list_tmp]
				let len = this.list.length
				for (let i = this.upload_index; i < len; i++) {
					this.list[this.upload_index].status = 1
					let r = await this.uploadFile(this.list[this.upload_index].file)
					if (!r) { // 上传失败
						this.list[this.upload_index].status = 3
					} else {
						// 上传成功
						let obj = JSON.parse(JSON.stringify(this.list[this.upload_index]))
						obj.status = 2
						obj.success_path = r
						// #ifdef H5
						if (obj.is_video) {
							obj.video_cover = await this.getVideoOneImgH5(obj.path)
						}
						// #endif
						this.list.splice(this.upload_index, 1, obj)
					}
					this.upload_index++
					this.progress = 0
				}

				let arr = this.list.map(item => item.success_path)
				this.$emit('success', arr)
			},
			// 上传文件到服务器
			async uploadFile(file) {
				const _this = this
				let res = this.xhr(file)
				return res
			},
			// xhr 封装
			xhr(file) {
				let _this = this
				return new Promise((resolv, reject) => {
					let form_data = new FormData()
					form_data.append(_this.name, file)
					// 载入其他表单参数
					if (_this.formData) {
						Object.keys(_this.formData).forEach(key => {
							form_data.append(key, _this.formData[key])
						})
					}

					let xhr = new XMLHttpRequest()
					xhr.timeout = err => {
						_this.timeout.call(null, err)
						reject(false)
					}
					xhr.ontimeout = _this.onTimeout
					xhr.onprogress = _this.onProgress
					xhr.onerror = err => {
						_this.onError.call(null, err)
						reject(false)
					}
					xhr.onload = () => {
						let response = JSON.parse(xhr.response)
						resolv(response.data.url)
					}

					xhr.open('POST', _this.action)
					// 载入请求头
					if (_this.headers) {
						Object.keys(_this.headers).forEach(key => {
							xhr.setRequestHeader(key, _this.headers[key])
						})
					}
					xhr.send(form_data)
				})
			},
			// 移除文件
			removeFile(index) {
				this.upload_index--
				this.list.splice(index, 1)
			},
			// 图片预览
			previewImage(path) {
				// 把列表中的图片全部取出来
				let list = this.list.map(item => {
					if (item.is_img) {
						return item.path
					}
					return ''
				}).filter(item => item)
				uni.previewImage({
					urls: list,
					current: path
				})
			},
			// 文件预览
			previewFile(path) {
				let tmp_arr = path.split('.')
				let file_type = tmp_arr[tmp_arr.length - 1] // 获取文件后缀

				// #ifdef MP-WEIXIN | MP-ALIPAY
				// 当前支持的文件预览
				let arr = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
				let flag = arr.some(item => item == file_type) // 该文件是否支持预览
				if (flag) {
					uni.openDocument({
						filePath: path,
						fileType: file_type, // 支付宝小程序，文件类型必填
						fail() {
							uni.showToast({
								title: '文档打开失败',
								icon: 'none'
							})
						}
					})
				}
				// #endif
				// #ifdef H5
				let arr = ['doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx']
				let flag = arr.some(item => item == file_type) // 该文件是否支持预览
				if (flag) {
					this.previewFileH5(path)
					return
				} else if (file_type == 'pdf') { // pdf 文件预览
					this.previewPDFh5(path)
					return
				}
				// #endif
				// 如果文件是视频
				if (this.jugdeVideo(file_type)) {
					this.previewVideo(path)
					return
				}
				uni.showToast({
					title: '该文件不支持预览',
					icon: 'none'
				})
			},
			// 视频预览
			previewVideo(path) {
				this.is_preview_video = true
				this.preview_video_src = path
			},
			// 关闭视频预览
			hidePreviewVideo() {
				this.is_preview_video = false
				this.preview_video_src = ''
			},
			// h5 办公文件预览
			previewFileH5(path) {
				let url = encodeURIComponent(path)
				this.h5_preview_file_src = 'http://view.officeapps.live.com/op/view.aspx?src=' + url
				window.open(this.h5_preview_file_src)
			},
			// H5 截取视频第一帧
			getVideoOneImgH5(path) {
				const _this = this
				return new Promise((resove, reject) => {
					let video = document.createElement('video')
					video.src = path
					video.addEventListener('loadeddata', () => {
						video.play() // 防止空白截图
						setTimeout(() => {
							video.pause()
							let salc = 0.5
							let canvas = document.createElement('canvas')
							canvas.width = video.videoWidth * salc
							canvas.height = video.videoHeight * salc
							canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas
								.height)
							let base64 = canvas.toDataURL('image/png')
							resove(base64)
						}, 500)
					})
				})
			},
			// h5 预览 pdf 文件
			previewPDFh5(path) {
				uni.showToast({
					title: '暂不支持浏览 pdf 文件',
					icon: 'none'
				})
			},
			// 判断是否是视频 
			jugdeVideo(type) {
				let reg = ['video', 'VIDEO', 'mp4', 'avi', 'wmv', '3gp', 'flv']
				return reg.some(item => type.includes(item))
			},
			// 判断是否是图片
			jugdePictrue(type) {
				let reg = ['image', 'IMAGE', 'bmp', 'jpg', 'png', 'gif', 'jpeg']
				return reg.some(item => type.includes(item))
			},
		}
	}
</script>

<style lang="scss" scoped>
	.form-item {}

	.form-file-upload {
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		.panel {
			flex-shrink: 0;
			position: relative;
			background-color: #F6F7F8;
			margin: 20rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			// &:nth-child(4n) {
			// 	margin-right: 0;
			// }
			.img-show {
				width: 100%;
				height: 100%;
			}

			.close {
				position: absolute;
				right: 0;
				top: 0;
				width: 26rpx;
				height: 26rpx;
				transform: translateX(30%) translateY(-30%);
				z-index: 9;
				padding: 10rpx;
				background-color: #fff;
				border-radius: 50%;
			}

			.img-name {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 10px;
				color: #B3B5B9;
				overflow: hidden;

				.img {
					width: 50rpx;
					height: 50rpx;
				}

				text {
					width: 100%;
					text-align: center;

					span {
						display: inline-block;
						width: 100%;
					}
				}
			}

			.upload-loading {
				position: absolute;
				width: 100%;
				height: 100%;
				font-size: 14px;
				color: white;
				background-color: rgba($color: #000000, $alpha: 0.5);
				display: flex;
				align-items: center;
				justify-content: center;

				img {
					width: 50rpx;
					height: 50rpx;
				}
			}
		}

		.upload-btn {
			height: 100%;
			width: 100%;
			border-radius: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px dashed #ccc;

			img {
				width: 50%;
				height: 50%;
			}
		}
	}

	.preview-video {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		background-color: black;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	
	.video {
			width: 100%;
			max-width: 100%;
			max-height: 100%;
			z-index: -1;
		}

		.close {
			position: fixed;
			right: 40rpx;
			top: 40rpx;
			color: $uni-color-primary;
			font-size: 14px;
		}
	}

	.preview-file-h5 {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		overflow: hidden;
		background-color: black;

		.close {
			position: fixed;
			right: 40rpx;
			top: 40rpx;
			color: $uni-color-primary;
			font-size: 14px;
		}
	}
</style>
