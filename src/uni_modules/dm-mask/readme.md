

## Mask 蒙版
> **组件名：dm-mask**
> 代码块： `dmMask`


视图蒙版组件。

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 ``template`` 中使用组件

```html
<dm-mask :show="true"></dm-mask>
<dm-mask :show.sync="show"></dm-mask>
<dm-mask :show.sync="show" width="50%" height="50%"  background-color="red" :z-index="99" closable></dm-mask>
<dm-mask :show.sync="show" :custom-style="{fontSize: '50px', color: 'red', padding: '15px 15px'}"></dm-mask>
<dm-mask :show.sync="show" @on-click="clickMask"></dm-mask>
<dm-mask :show.sync="show" @on-click="clickMask">
	<button type="default" @click.stop="clickButton()">点击</button>
</dm-mask>
```

``注意：``
- 如果给mask添加了点击事件，则在它内部的元素如果也存在点击事件，为了防止事件冒泡触发，需要使用``.stop``事件修饰符来解决事件冒泡可能触发的多重点击问题。

## API

### Mask Props

|属性					|类型		|默认值		|必填		|说明	|
|:-:					|:-:		|:-:		|:-:		|:-:	|
|show					|Boolean	|false		|是			|是否显示，默认true显示，false不显示。需要使用`.sync`双向绑定，否则改变状态时并不能改变使用者的数据|
|width					|String		|100%		|否			|宽度	|
|height					|String		|100%		|否			|高度	|
|background-color		|String		|rgba(0, 0, 0, 0.5)		|否		|背景颜色 |
|z-index				|String		|99			|否			|元素的堆叠顺序，数值越大，会覆盖在较小的元素的上层进行显示|
|custom-style			|Object		|{}			|否			|自定义 Mask 样式，样式对象语法|
|closable				|Boolean	|false		|false		|是否显示关闭按钮，默认值false不显示，true显示|

``说明：``
- 这里z-index属性设置值超过997后为全屏蒙版（将会遮盖状态栏），将会覆盖状态栏。当值小于等于997，将不遮盖状态栏，在状态栏下形成蒙版。所以在开发中请合理设置z-index值大小，这里默认值为99，不会覆盖状态栏。如不需要全屏蒙版，则不需要重新设置z-index值大小。

### Mask Events

|事件名	|事件说明			|返回参数	|
|:-:	|:-:				|:-:		|
|@on-click	|点击 Mask 触发事件	| -			|


### Mask Slots

``Mask 支持插槽，直接在mask组件内部进行视图编辑``