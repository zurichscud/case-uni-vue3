# km-file-upload
表单系列，文件上传(包括文件预览)，图片上传，文件上传，视频上传
> 空明组件-表单系列-文件上传

## props
|  参数  		| 类型 		| 默认值 | 是否必须 | 说明 |
| ------------- | --------- | ------| --- 	| ---- |
| action  		| String 	|  		| 	是	| 该值必须，否则报错 |
| maxFile 		| Number 	| 1 	| 		| 最大上传数 |
| disabled 	 	| Boolean 	| false | 		| 是否禁用上传 |
| height  		| Number 	| 50 	| 		| 表单宽高，该值控制宽度和高度。单位 px |
| headers  		| Object 	|		| 		| 请求头 |
| name  		| String 	| 		| 		| 上传文件的 name |
| timeout  		| Number 	| 60000	| 		| 超时时间。单位毫秒(ms) |
| formData  	| Object 	| 		| 		| 表单其他参数 |
| onTimeout  	| Function 	| 		| 		| 超时回调 |
| onProgress  	| Function 	| 		| 		| 上传进度回调 |
| onError  		| Function	|  		| 		| 上传错误回调 |

## event
|  事件名  |  说明 |
| ------------- | ------------- |
| @success | 上传成功回调 |

## slot
|  插槽名  |  说明 |
| ------------- | ------------- |
| default | 默认插槽 |

## 使用
```
<km-file-upload
	:action="action"
	:onTimeout="onTimeout"
	@success='success'></km-file-upload>


```
## PS: 

1. 插件符合 easycom 规范，可以直接在页面中使用
2. 建议先下载示例项目运行查看
3. 视频，图片，办公文件可预览(h5 pdf文件目前不可预览)

<br>
**欢迎各位大佬指正**