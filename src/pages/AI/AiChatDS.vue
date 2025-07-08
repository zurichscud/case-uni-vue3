<!-- 弈寻deepseek -->
<template>
  <!-- AI聊天主页面 -->
  <view class="main">
    <!-- 顶部导航栏 -->
    <view class="top_nav" :style="{ marginTop: safeAreaInsets.top + 'px' }">
      <view class="left">
        <!-- 返回按钮 -->
        <u-icon name="arrow-left" @click="goBack" size="20"></u-icon>
        <!-- 历史记录按钮 -->
        <u-icon name="list" @click="show = true" size="20"></u-icon>
      </view>
      <view class="title">弈寻</view>
      <view class="right"></view>
    </view>

    <!-- 聊天消息滚动区域 -->
    <scroll-view
      scroll-y="true"
      class="scroll"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      :style="{
        paddingBottom: `calc(${keyboardHeight}px + 204rpx)`,
        paddingTop: `calc(${safeAreaInsets.top}px + 100rpx)`,
      }"
    >
      <view style="height: 20rpx"></view>

      <!-- 初始介绍页面，当没有消息时显示 -->
      <view class="introduction" v-if="!messages.length">
        <view class="title">
          <image
            class="avatar"
            src="https://iclaim.oss-cn-beijing.aliyuncs.com/2025/02/4223b31480c2421c9745be8c15563e4a.png"
          ></image>
          <text>你好，我是弈寻理赔智脑！</text>
        </view>
        <view class="content">
          我使用的模型为DeepSeek-R1-671B全尺寸满血版，搜索数据由弈寻知识库和联网知识库组成，请问我保单全生命周期与理赔相关的所有问题。在这里，我能同步解读最新的理赔政策和裁判规则，更精准提供复杂案件的解决方案，避免责任误判，发现最大合理边界。
        </view>
      </view>

      <!-- 消息列表渲染 -->
      <view class="item_message" v-for="(item, index) in messages" :key="index">
        <!-- AI消息（type: 0） -->
        <view class="ai_message" v-if="item.type === 0">
          <image
            class="avatar"
            src="https://iclaim.oss-cn-beijing.aliyuncs.com/2025/02/4223b31480c2421c9745be8c15563e4a.png"
          ></image>
          <view class="msg_content">
            <view class="ai_name">弈寻AI</view>
            <view class="msg_bubble">
              <!-- AI思考过程 -->
              <view class="thought" v-if="item.msg.thought">
                <view class="title">思考过程：</view>
                <text :user-select="true">{{ item.msg.thought }}</text>
              </view>
              <!-- AI回复内容 -->
              <view class="reply" v-if="item.msg.reply">
                <text :user-select="true">{{ item.msg.reply }}</text>
              </view>
              <!-- 引用文献 -->
              <view class="reference" v-if="item.msg.references && item.msg.references.length">
                <view class="reference-title">引用文献</view>
                <view class="reference-list">
                  <view class="reference-item" v-for="(re, idx) in item.msg.references" :key="idx">
                    <u-icon name="file-text" size="14" color="#6190E8"></u-icon>
                    <text class="reference-index">[{{ idx + 1 }}]</text>
                    <text class="reference-name">{{ re.name }}</text>
                  </view>
                </view>
              </view>
              <!-- 加载动画（生成中显示） -->
              <view class="loader" v-if="index === lastIndex && loading"></view>
              <!-- 操作按钮（复制、反馈） -->
              <view class="bottom_btns" v-else>
                <view class="left"></view>
                <view class="right">
                  <text class="iconfont icon-fuzhi" @click="copyText(item.msg.reply)"></text>
                  <text
                    class="iconfont icon-cai"
                    @click="openFeedback(messages[index - 1].msg)"
                  ></text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 用户消息（type: 1） -->
        <view class="user_message" v-else>
          <image
            class="avatar"
            :src="userStore.photo"
          ></image>
          <view class="msg_content">
            <view class="ai_name">{{ userStore.nickName }}</view>
            <view class="msg_bubble">
              <!-- 图片消息 -->
              <image
                :src="item.msg"
                style="width: 500rpx"
                mode="widthFix"
                v-if="item.isImage"
              ></image>
              <!-- 文本消息 -->
              <text :user-select="true" v-else>{{ item.msg }}</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 20rpx"></view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input_area" :style="{ bottom: keyboardHeight + 'px' }">
      <!-- 待发送图片预览 -->
      <view class="images" v-if="images.length">
        <view class="img" v-for="(item, index) in images" :key="item">
          <view class="icon">
            <image :src="item" mode="aspectFit"></image>
          </view>
          <view class="del_box" @click="delImage(index)">
            <text class="iconfont icon-closeempty"></text>
          </view>
        </view>
      </view>

      <!-- 消息输入框 -->
      <textarea
        class="chat_input"
        auto-height
        :maxlength="400"
        :adjust-position="false"
        v-model="inputMsg"
        placeholder="输入您的问题..."
      />

      <!-- 功能按钮区域 -->
      <view class="btns">
        <view class="left">
          <!-- 联网搜索按钮 -->
          <view class="btn internet">
            <text class="iconfont icon-hulianwang"></text>
            <text>联网搜索</text>
          </view>
          <!-- 深度思考按钮 -->
          <view class="btn deep">
            <text class="iconfont icon-shendusikao"></text>
            <text>深度思考</text>
          </view>
        </view>
        <view class="right">
          <!-- 图片上传按钮 -->
          <view
            class="btn-ra closeempty"
            :style="{ transform: showPhoto ? 'rotate(0)' : 'rotate(45deg)' }"
            @click="showPhoto = !showPhoto"
          >
            <text class="iconfont icon-closeempty"></text>
          </view>
          <!-- 停止生成按钮（生成中显示） -->
          <view class="btn-ra up" @click="stop" v-if="loading">
            <text class="iconfont icon-stop"></text>
          </view>
          <!-- 发送消息按钮 -->
          <view class="btn-ra up" @click="sendMessage" v-else>
            <text class="iconfont icon-up"></text>
          </view>
        </view>
      </view>

      <!-- 图片上传选项（拍照/相册） -->
      <view class="upload_btn" :style="{ height: showPhoto ? 260 + 'rpx' : 0 }">
        <view class="item photo" @click="uploadImage('camera')">
          <view class="btn">
            <text class="iconfont icon-paizhao"></text>
          </view>
          <view class="text">拍照</view>
        </view>
        <view class="item photobook" @click="uploadImage('album')">
          <view class="btn">
            <text class="iconfont icon-xiangce"></text>
          </view>
          <view class="text">相册</view>
        </view>
      </view>
    </view>

    <!-- 历史记录侧边栏 -->
    <u-popup v-if="false" :show="show" mode="left" @close="close">
      <view
        class="history-list"
        :style="{
          height: `calc(100vh - ${safeAreaInsets.top}px)`,
          paddingTop: `${safeAreaInsets.top}px`,
        }"
      >
        <!-- 历史记录标题 -->
        <view class="list-header">
          <text class="title">对话历史</text>
          <!-- <u-icon name="clock" size="20" color="#666"></u-icon> -->
        </view>

        <scroll-view scroll-y class="list-scroll">
          <!-- 历史记录项 -->
          <view
            v-for="item in history"
            :key="item.sessionId"
            class="history-item"
            :class="{ active: item.sessionId === currentHistoryId }"
            @click="loadHistory(item)"
          >
            <text class="item-preview">{{ item.content }}</text>
            <text class="iconfont icon-shanchu" @click.stop="delHistory(item.sessionId)"></text>
          </view>

          <!-- 空状态 -->
          <view v-if="history.length === 0" class="empty">
            <u-icon name="list" size="60" color="#ccc"></u-icon>
            <text class="empty-text">暂无历史对话</text>
          </view>
        </scroll-view>
      </view>
    </u-popup>

    <!-- 消息反馈组件 -->
    <MsgFeedback ref="FeedbackRef" v-if="false"></MsgFeedback>
  </view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import MsgFeedback from './components/MsgFeedback.vue'
import { nextTick, ref } from 'vue'
import * as AIAPI from '@/apis/ai'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const keyboardHeight = ref(0)
const scrollTop = ref(0)
const history = ref([])
const inputMsg = ref('') //输入框内容
const images = ref([])
const messages = ref([])
const lastIndex = ref(0)
const loading = ref(false)
const checkReplyInterval = ref(null)
const safeAreaInsets = ref({})
const lastReplyLength = ref(0)
const MSG_TYPE = {
  AI: 0,
  USER: 1,
}
const endText = `\n\n**重要提示**\n
    感谢您访问弈寻！本智能体提供的信息仅供一般参考，不构成正式法律意见。
    用户应自行判断信息的准确性、完整性或适用性，并承担因依赖此类信息而产生的风险。` // AI回复结尾提示文本

let requestTask = null
let session_id = ''
const showPhoto = ref(false)
let partialDataBuffer = ''

async function sendMessage() {
  if (!inputMsg.value) {
    uni.showToast({
      title: '请输入问题',
      icon: 'none',
    })
    return
  }
  if (images.value.length) {
    images.value.forEach((item) => {
      messages.value.push({
        type: MSG_TYPE.USER,
        msg: item,
        isImage: true,
      })
    })
  }
  messages.value.push({
    type: MSG_TYPE.USER,
    msg: inputMsg.value,
    isImage: false,
  })
  //提前准备一个ai消息对象，用于接收回复
  messages.value.push({
    type: MSG_TYPE.AI,
    msg: {},
  })
  lastIndex.value = messages.value.length - 1
  inputMsg.value = ''
  goBottom()
  loading.value = true
  startReplyCheck()

  requestTask = uni.request({
    url: import.meta.env.VITE_BASE_URL + '/chat-room/send',
    method: 'POST',
    enableChunked: true,
    timeout: 1000 * 60 * 3,
    header: {
      'X-DashScope-SSE': 'enable',
      Authorization: `Bearer ${userStore.token}`,
    },
    data: {
      question: images.value.length
        ? fliterImages() + messages[lastIndex.value - 1].msg
        : messages.value[lastIndex.value - 1].msg,
      sessionId: session_id,
    },
    success: (res) => {
      //流式传输结束后触发
      console.log('请求成功', res)
    },
    fail: (e) => {
      console.log('出现错误了', e)
    },
  })

  showPhoto.value = false
  images.value = []
  requestTask.onChunkReceived(listenerFn)
}

function cleanupRequest() {
  if (requestTask) {
    requestTask.abort()
    requestTask = null
  }
}

function listenerFn({ data }) {
  try {
    let un8 = new Uint8Array(data)
    let jsonString = bufferToUtf8(un8)
    console.log('*********jsonString*********', jsonString)
    un8 = null
    const rawData = partialDataBuffer + jsonString //JSON字符串
    // console.log('*********parseSSEString*********', parseSSEString(rawData))
    const eventMatch = rawData.match(/event:(\w+)\s+data:(\{.*?\})(?=\s|$)/s)
    if (eventMatch && eventMatch[2]) {
      const dataObj = JSON.parse(eventMatch[2])
      console.log('[ dataObj ]-489', dataObj)
      const { type, payload } = dataObj
      if (payload.is_evil) {
        messages.value = {
          type: 0,
          msg: {
            reply: '涉及敏感内容，停止回答',
          },
        }
        loading.value = false
        stopReplyCheck()
        goBottom()
      }
      if (payload.is_from_self) {
        partialDataBuffer = ''
        return
      }
      const currentMessage = messages.value[lastIndex.value]
      //{type:0,msg:{reply:'',thought:'',references:[]}}
      console.log('currentMessage', currentMessage)
      const record = {
        ...currentMessage,
      }
      console.log('record', record)
      if (type === 'reply') {
        session_id = payload.session_id
        record.msg.reply = payload.content
        if (payload.is_final) {
          //如果结束需要附带免责声明
          record.msg.reply += endText
        }
      } else if (type === 'thought') {
        session_id = payload.session_id
        record.msg.thought = payload?.procedures[0]?.debugging?.content || ''
      } else if (type === 'reference') {
        // 引用文献
        const refe = payload?.references.filter((a) => a.name) || []
        // 去重操作，依据name字段
        const uniqueReferences =
          refe.filter(
            (reference, index, self) => index === self.findIndex((r) => r.name === reference.name),
          ) || ''
        record.msg.references = uniqueReferences
      }
      messages.value[lastIndex.value] = record
      //消息队列，ai消息type为0。type=0时，msg为对象，包含reply、thought、references
      //用户消息type为1。type=1时，msg为字符串，isImage是否为图片
      console.log(messages.value)

      // 如果是最终回复，停止生成
      if (type === 'reply' && payload.is_final) {
        loading.value = false
        goBottom()
        stopReplyCheck() //停止监听回答长度
      }

      // 解决完整字符串结尾出现event的情况
      const strArr = jsonString.split('\n\nevent')
      if (strArr.length > 1) {
        partialDataBuffer = 'event' + strArr[1]
      } else {
        // 清空缓冲区
        partialDataBuffer = ''
      }
    } else {
      partialDataBuffer = rawData
    }
  } catch (e) {
    console.log('error', e)
  }
  goBottom()
}

function parseSSEString(sseString) {
  const lines = sseString.trim().split('\n')
  let eventType = ''
  let data = ''

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventType = line.substring(6).trim()
    } else if (line.startsWith('data:')) {
      // 拼接多行数据（如果存在）
      data += line.substring(5).trim() + '\n'
    }
  }

  try {
    const parsedData = JSON.parse(data.trim())
    return { eventType, data: parsedData }
  } catch (e) {
    throw new Error('解析JSON失败，错误字符串: ' + sseString)
  }
}

function fliterImages() {
  return images.value.map((item) => `![](${item})`).join('\n') + '***'
}

function stopReplyCheck() {
  if (checkReplyInterval.value) {
    clearInterval(checkReplyInterval.value)
    checkReplyInterval.value = null
  }
}

//滚动到底部
function goBottom() {
  setTimeout(() => {
    const tempTop = Date.now()
    scrollTop.value = tempTop - 1
    nextTick(() => {
      scrollTop.value = tempTop
    })
  }, 100)
}

async function getChatHistoryData() {
  const { data } = await AIAPI.getChatHistory({ userId: userStore.id })
  history.value = data.map((item) => {
    const strs = item.content.split('***')
    return {
      ...item,
      content: strs.length > 1 ? strs[1] : strs[0],
    }
  })
}

function startReplyCheck() {
  stopReplyCheck()
  checkReplyInterval.value = setInterval(() => {
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage.value && lastMessage.value.msg) {
      const currentReplyLength = lastMessage.value.msg.reply
        ? lastMessage.value.msg.reply.length
        : 0
      if (currentReplyLength === lastReplyLength.value && currentReplyLength !== 0) {
        stop()
      } else {
        lastReplyLength.value = currentReplyLength
      }
    }
  }, 5000)
}

function bufferToUtf8(buffer) {
  const bytes = buffer
  let text = ''

  let i = 0
  while (i < bytes.length) {
    const byte1 = bytes[i++]
    if (byte1 < 0x80) {
      // 单字节字符
      text += String.fromCharCode(byte1)
    } else if (byte1 >= 0xc0 && byte1 < 0xe0) {
      // 双字节字符
      const byte2 = bytes[i++] & 0x3f
      text += String.fromCharCode(((byte1 & 0x1f) << 6) | byte2)
    } else if (byte1 >= 0xe0) {
      // 三字节字符
      const byte2 = bytes[i++] & 0x3f
      const byte3 = bytes[i++] & 0x3f
      text += String.fromCharCode(((byte1 & 0x0f) << 12) | (byte2 << 6) | byte3)
    }
  }

  return text
}

function stop() {}

//复制文本
function copyText(text) {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
      })
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'none',
      })
    },
  })
}

function openFeedback(msg) {}

function delHistory(sessionId) {}

function loadHistory(item) {}

onLoad(() => {
  getChatHistoryData()
})

onShow(() => {
  uni.onKeyboardHeightChange((res) => {
    console.log(res)
    keyboardHeight.value = res.height
    goBottom()
  })
  // 解决安全区失效问题
  const getSafeAreaTop = () => {
    const { safeArea } = wx.getWindowInfo()
    return safeArea?.top || wx.getSystemInfoSync()?.statusBarHeight || 0
  }
  safeAreaInsets.value.top = getSafeAreaTop()
})
</script>

<style lang="scss" scoped>
scroll-view,
input,
textarea {
  box-sizing: border-box;
}

.upload_btn {
  display: flex;
  justify-content: space-between;
  transition: all 0.3s;

  .item {
    width: 48%;

    .btn {
      height: 180rpx;
      border-radius: 30rpx;
      background-color: #f5f5f5;
      text-align: center;
      line-height: 180rpx;

      .iconfont {
        font-size: 50rpx;
      }
    }

    .text {
      text-align: center;
      margin-top: 10rpx;
      font-size: 28rpx;
      color: #7f7f7f;
    }
  }
}

.introduction {
  font-size: 26rpx;
  line-height: 48rpx;

  .title {
    // background-color: red;
    display: flex;
    align-items: center;

    image {
      width: 50rpx;
      height: 50rpx;
    }

    text {
      margin-left: 15rpx;
    }
  }
}

.top_nav {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-bottom: 2rpx solid #fafafa;
  background-color: #fefefe;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  .left {
    display: flex;
    align-items: center;
    gap: 20rpx; // 图标间距
  }

  .title {
    font-size: 36rpx;
    font-weight: 600;
    letter-spacing: 1rpx;
  }

  .right {
    // 保持对称布局，可放置其他图标
    width: 80rpx;
    height: 80rpx;
  }
}

.loader {
  width: 60px;
  aspect-ratio: 4;
  --_g: no-repeat radial-gradient(circle closest-side, #b36e6e 90%, #0000);
  background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
  background-size: calc(100% / 3) 100%;
  animation: l7 1s infinite linear;
}

@keyframes l7 {
  33% {
    background-size: calc(100% / 3) 0%, calc(100% / 3) 100%, calc(100% / 3) 100%;
  }

  50% {
    background-size: calc(100% / 3) 100%, calc(100% / 3) 0%, calc(100% / 3) 100%;
  }

  66% {
    background-size: calc(100% / 3) 100%, calc(100% / 3) 100%, calc(100% / 3) 0%;
  }
}

page {
  height: 100%;
}

.main {
  height: 100%;

  .scroll {
    height: 100%;
    background-color: #feffff;
    padding: 0 30rpx;

    .item_message {
      margin-bottom: 40rpx;

      // 机器人回答
      .ai_message {
        display: flex;
        align-items: flex-start;
        background-color: transparent;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }

        .msg_content {
          margin-left: 20rpx;
          max-width: 80%;

          .ai_name {
            font-size: 24rpx;
            color: #888;
            margin-bottom: 5rpx;
          }

          .msg_bubble {
            background: #fff;
            border-radius: 10rpx;
            padding: 20rpx;
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
            margin-top: 10rpx;
            word-break: break-word; // 允许在单词内换行

            .bottom_btns {
              margin-top: 10rpx;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .iconfont {
                font-size: 40rpx;
              }

              .right {
                display: flex;
                align-items: center;

                .icon-cai {
                  margin-left: 30rpx;
                }
              }
            }
          }
        }
      }

      // 用户提问
      .user_message {
        display: flex;
        align-items: flex-start;
        flex-direction: row-reverse;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }

        .msg_content {
          margin-right: 20rpx;
          max-width: 80%;

          .ai_name {
            text-align: right;
            font-size: 24rpx;
            color: #888;
            margin-bottom: 5rpx;
          }

          .msg_bubble {
            word-break: break-all;
            background: #6190e8;
            border-radius: 40rpx 0 40rpx 40rpx;
            padding: 20rpx;
            color: white;
          }
        }
      }
    }
  }

  .input_area {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0 30rpx;
    background-color: #feffff;

    .images {
      width: 100%;
      height: 130rpx;
      display: flex;
      align-items: flex-end;
      overflow-x: scroll;

      .img {
        // width: 280rpx;
        height: 105rpx;
        border-radius: 20rpx;
        border: 2rpx solid #c7baba;
        box-sizing: border-box;
        display: flex;
        position: relative;
        margin-right: 20rpx;

        .del_box {
          position: absolute;
          top: -18rpx;
          right: -18rpx;
          width: 36rpx;
          height: 36rpx;
          border-radius: 36rpx;
          background-color: #feffff;
          border: 2rpx solid #c7baba;

          display: flex;
          align-items: center;
          justify-content: center;

          .iconfont {
            font-size: 15rpx;
          }
        }
      }

      .icon {
        width: 105rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        image {
          width: 80rpx;
          height: 80rpx;
        }
      }

      .name {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 8rpx;
      }

      .size {
        color: #919191;
      }
    }

    .btns {
      display: flex;
      justify-content: space-between;
      color: #919191;
      padding: 18rpx 0;

      .btn {
        padding: 0 20rpx;
        text-align: center;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 60rpx;
        font-size: 24rpx;

        .iconfont {
          margin-right: 10rpx;
        }
      }

      .deep,
      .internet {
        background-color: #e3effd;
        color: #6090c7;
      }

      .new {
        background-color: #feffff;
      }

      .left {
        display: flex;
      }

      .right {
        display: flex;

        .btn-ra {
          height: 60rpx;
          width: 60rpx;
          border-radius: 60rpx;
          text-align: center;
          line-height: 60rpx;

          .iconfont {
            font-size: 30rpx;
          }
        }

        .closeempty {
          color: #161616;
          margin-right: 10rpx;
          transition: all 0.3s;
          transform: rotate(45deg);
        }

        .up {
          color: #fff;
          background-color: #3b84f5;
        }
      }

      .deep {
        margin-left: 12rpx;
      }
    }

    .chat_input {
      width: 100%;
      background-color: #f8f8f8;
      border-radius: 40rpx;
      padding: 30rpx 30rpx;
      font-size: 26rpx;
      vertical-align: middle;
      margin-top: 17rpx;
    }

    .send_btn {
      background: #6190e8;
      color: white;
      border-radius: 40rpx;
      padding: 0 40rpx;
      height: 80rpx;
      line-height: 80rpx;
    }
  }
}

.thought {
  background-color: #f0f8ff;
  /* 浅蓝色背景 */
  border-left: 5rpx solid #007aff;
  /* 左侧蓝色边框 */
  padding: 10rpx;
  border-radius: 5rpx;
  margin-bottom: 10rpx;
  /* 与回复内容的间距 */
  color: #7d7d7d;
  /* 深色文字 */
  font-size: 28rpx;
  /* 字体大小 */
}

.reply {
  // background-color: #e6ffe6; /* 浅绿色背景 */
  // border-left: 5rpx solid #4caf50; /* 左侧绿色边框 */
  padding: 10rpx;
  border-radius: 5rpx;
  color: #333;
  /* 深色文字 */
  font-size: 28rpx;
  /* 字体大小 */
}

.history-list {
  width: 600rpx;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2rpx solid #eee;
    padding: 40rpx 30rpx 20rpx 30rpx;

    .title {
      font-size: 34rpx;
      font-weight: 600;
      color: #2c3e50;
    }
  }

  .list-scroll {
    height: 0;
    flex: 1;
    padding: 30rpx;
  }

  .history-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    display: flex;

    &:active {
      transform: scale(0.98);
    }

    &.active {
      border-left: 8rpx solid #6190e8;
      background: #f5f8ff;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
    }

    .item-title {
      font-size: 30rpx;
      color: #2c3e50;
      font-weight: 500;
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-time {
      font-size: 24rpx;
      color: #95a5a6;
    }

    .item-preview {
      font-size: 26rpx;
      color: #7f8c8d;
      line-height: 1.4;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;

    .empty-text {
      font-size: 28rpx;
      color: #bdc3c7;
      margin-top: 20rpx;
    }
  }
}

.reference {
  margin-top: 20rpx;
  background: #f8f9fc;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1px solid #eceff7;

  &-title {
    font-size: 26rpx;
    color: #6190e8;
    font-weight: 500;
    padding-bottom: 12rpx;
    border-bottom: 1px dashed #e0e6f0;
    margin-bottom: 12rpx;
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
  }

  &-item {
    display: flex;
    align-items: center;
    padding: 8rpx 0;
    font-size: 24rpx;
    color: #666;
  }

  &-index {
    color: #6190e8;
    margin: 0 8rpx;
    font-weight: 500;
  }

  &-name {
    flex: 1;
    word-break: break-all;
    line-height: 1.4;
    margin-left: 10rpx;
  }
}
</style>
