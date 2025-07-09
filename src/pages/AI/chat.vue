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
          <image class="avatar" :src="AI_AVATAR"></image>
          <text>{{ AI_HELLO }}</text>
        </view>
        <view class="content">
          {{ AI_INTRODUCTION }}
        </view>
      </view>

      <!-- 消息列表渲染 -->
      <view class="item_message" v-for="(item, index) in messages" :key="index">
        <!-- AI消息（type: 0） -->
        <view class="ai_message" v-if="item.type === 0">
          <image class="avatar" :src="AI_AVATAR"></image>
          <view class="msg_content">
            <view class="ai_name">弈寻AI</view>
            <view class="msg_bubble">
              <!-- 已深度思考 -->
              <view class="thought" v-if="item.msg.thought">
                <view class="thought-header" @click="toggleThought(index)">
                  <view class="title">
                    {{ thinkText }}
                    <text class="time-info" v-if="item.time">
                      （用时 {{ Math.floor(item.time / 1000) }} 秒）
                    </text>
                  </view>
                  <i
                    class="iconfont icon-jiantou_liebiaozhankai"
                    :class="{ expanded: item.expand }"
                  ></i>
                </view>
                <!-- 思考过程内容 -->
                <view class="thought-content" :class="{ show: item.expand }">
                  <MarkdownRenderer
                    :content="item.msg.thought"
                    font-size="26rpx"
                    text-color="#7d7d7d"
                    line-height="1.5"
                  ></MarkdownRenderer>
                </view>
              </view>
              <!-- AI回复内容 -->
              <view class="reply" v-if="item.msg.reply">
                <MarkdownRenderer
                  :content="item.msg.reply"
                  font-size="28rpx"
                  text-color="#333"
                  line-height="1.6"
                ></MarkdownRenderer>
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
              <!-- 重要提示 -->
              <view
                class="important-notice"
                v-if="item.msg.reply && !(index === lastIndex && loading)"
              >
                <view class="notice-title">重要提示</view>
                <text class="notice-content">{{ END_TEXT }}</text>
              </view>
              <!-- 加载动画（生成中显示） -->
              <view class="loader" v-if="index === lastIndex && loading">
                <view class="thinking-dots">
                  <view class="dot"></view>
                  <view class="dot"></view>
                  <view class="dot"></view>
                </view>
              </view>
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
          <image class="avatar" :src="userStore.photo"></image>
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
        v-model="userInput"
        placeholder="输入您的问题..."
      />

      <!-- 功能按钮区域 -->
      <view class="btns">
        <view class="left">
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
            :style="{ transform: uploadVisible ? 'rotate(0)' : 'rotate(45deg)' }"
            @click="uploadVisible = !uploadVisible"
          >
            <text class="iconfont icon-closeempty"></text>
          </view>
          <!-- 停止生成按钮（生成中显示） -->
          <view class="btn-ra up" @click="handleStop" v-if="loading">
            <text class="iconfont icon-stop"></text>
          </view>
          <!-- 发送消息按钮 -->
          <view class="btn-ra up" @click="handleSend" v-else>
            <text class="iconfont icon-up"></text>
          </view>
        </view>
      </view>

      <!-- 图片上传选项（拍照/相册） -->
      <view class="upload_btn" :style="{ height: uploadVisible ? 260 + 'rpx' : 0 }">
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
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import MsgFeedback from './components/MsgFeedback.vue'
import { nextTick, ref, computed } from 'vue'
import * as AIAPI from '@/apis/ai'
import { useUserStore } from '@/stores'
import { END_TEXT, AI_AVATAR, AI_INTRODUCTION, AI_HELLO } from './data'
import { SSEHandler } from './utils'
import { uploadFile } from '@/utils/http'

const userStore = useUserStore()
const keyboardHeight = ref(0)
const scrollTop = ref(0)
const history = ref([])
const userInput = ref('') //输入框内容
const images = ref([])
const messages = ref([])
const lastIndex = computed(() => messages.value.length - 1)
const loading = ref(false)
let checkReplyInterval = null //检查回复长度
const safeAreaInsets = ref({})
const lastReplyLength = ref(0)
const thinkText = ref('已深度思考')
const MSG_TYPE = {
  AI: 0,
  USER: 1,
}
let requestTask = null
let session_id = ''
const uploadVisible = ref(false)
let sseHandler = null //SSE处理器实例

// 初始化SSE处理器
function initSSEHandler() {
  sseHandler = new SSEHandler({
    onEvent: (eventType, parsedData) => {
      processSSEData(eventType, parsedData)
    },
    onError: (error) => {
      console.error('SSE处理器错误:', error)
      handleRequestError()
    },
    onComplete: () => {
      loading.value = false
      stopReplyCheck()
    },
    debug: import.meta.env.MODE === 'development',
  })
}

async function handleSend() {
  if (!userInput.value.trim()) {
    uni.showToast({
      title: '请输入问题',
      icon: 'none',
    })
    return
  }

  // 清理之前的请求
  cleanupRequest()

  // 处理图片消息
  if (images.value.length) {
    images.value.forEach((item) => {
      messages.value.push({
        type: MSG_TYPE.USER,
        msg: item,
        isImage: true,
      })
    })
  }

  // 添加用户消息
  const userMessage = userInput.value.trim()
  messages.value.push({
    type: MSG_TYPE.USER,
    msg: userMessage,
    isImage: false,
  })

  // 准备AI回复消息对象
  messages.value.push({
    type: MSG_TYPE.AI,
    expand: true,
    time: 0,
    msg: {
      reply: '',
      thought: '',
      references: [],
    },
  })

  // 重置状态
  userInput.value = ''
  uploadVisible.value = false
  goBottom()
  loading.value = true
  startReplyCheck()

  try {
    // 构建请求数据
    const requestData = {
      question: images.value.length ? imgsToMarkdown(images.value) + userMessage : userMessage,
      sessionId: session_id,
    }

    console.log('发送SSE请求:', requestData)

    requestTask = uni.request({
      url: import.meta.env.VITE_BASE_URL + '/chat-room/send',
      method: 'POST',
      enableChunked: true,
      timeout: 1000 * 60 * 3, // 3分钟超时
      header: {
        'X-DashScope-SSE': 'enable',
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
      data: requestData,
      success: (res) => {
        console.log('SSE请求成功:', res)
        // 通知SSE处理器完成
        sseHandler?.complete()
      },
      fail: (error) => {
        console.error('SSE请求失败:', error)
        handleRequestError()
      },
    })

    // 监听数据流
    requestTask.onChunkReceived((chunk) => {
      if (sseHandler) {
        sseHandler.handleData(chunk.data)
      }
    })

    // 清空已处理的图片
    images.value = []
  } catch (error) {
    console.error('发送消息时出错:', error)
    handleRequestError()
  }
}

// 清理请求资源
function cleanupRequest() {
  if (requestTask) {
    try {
      requestTask.offChunkReceived()
      requestTask.abort()
    } catch (e) {
      console.warn('清理请求时出错:', e)
    }
    requestTask = null
  }
}

// 处理请求错误
function handleRequestError() {
  loading.value = false
  stopReplyCheck()

  // 通过AI告诉用户出错
  messages.value[lastIndex.value] = {
    type: MSG_TYPE.AI,
    expand: true,
    time: 0,
    msg: {
      reply: '抱歉，网络连接出现问题，请稍后重试。',
      thought: '',
      references: [],
    },
  }

  goBottom()
}

// 处理解析后的SSE数据
function processSSEData(eventType, parsedData) {
  try {
    const { type, payload } = parsedData

    // 检查敏感内容
    if (payload.is_evil) {
      const currentMessage = messages.value[lastIndex.value]
      if (currentMessage && currentMessage.type === MSG_TYPE.AI) {
        currentMessage.msg = {
          reply: '涉及敏感内容，停止回答',
          thought: '',
          references: [],
        }
        currentMessage.expand = true
        currentMessage.time = 0
        messages.value[lastIndex.value] = currentMessage
      }
      loading.value = false
      stopReplyCheck()
      goBottom()
      return
    }

    // 跳过自己发送的消息
    if (payload.is_from_self) {
      return
    }

    // 更新session_id
    if (payload.session_id) {
      session_id = payload.session_id
    }

    // 获取当前AI消息
    const currentMessage = messages.value[lastIndex.value]
    if (!currentMessage || currentMessage.type !== MSG_TYPE.AI) {
      console.warn('当前消息不是AI消息，跳过处理')
      return
    }

    // 深拷贝当前消息以避免响应性问题
    const updatedMessage = {
      ...currentMessage,
      msg: {
        ...currentMessage.msg,
      },
    }

    // 根据数据类型更新消息内容
    switch (type) {
      case 'reply':
        buildReplyData(updatedMessage, payload)
        break
      case 'thought':
        buildThoughtData(updatedMessage, payload)
        break
      case 'reference':
        buildReferenceData(updatedMessage, payload)
        break
      case 'token_stat':
        processTokenStatData(updatedMessage, payload)
        break
      case 'error':
        processErrorData(updatedMessage, payload)
        break
      default:
        console.log('未知的SSE数据类型:', type)
    }

    // 更新消息数组
    messages.value[lastIndex.value] = updatedMessage

    // 自动滚动到底部
    goBottom()
  } catch (error) {
    console.error('处理SSE数据时出错:', error)
  }
}

// 处理回复数据
function buildReplyData(message, payload) {
  try {
    let replyContent = payload.content || ''

    // 如果是最终回复，结束加载状态
    if (payload.is_final && replyContent) {
      // 结束加载状态
      loading.value = false
      stopReplyCheck()
    }

    message.msg.reply = replyContent
  } catch (error) {
    console.error('处理回复数据时出错:', error)
  }
}

// 处理思考过程数据
function buildThoughtData(message, payload) {
  try {
    const thoughtContent = payload?.procedures?.[0]?.debugging?.content || ''
    message.msg.thought = thoughtContent
  } catch (error) {
    console.error('处理思考数据时出错:', error)
  }
}

// 处理引用文献数据
function buildReferenceData(message, payload) {
  try {
    const references = payload?.references || []

    // 过滤和去重引用文献
    const validReferences = references
      .filter((ref) => ref && ref.name) // 过滤有效引用
      .filter(
        (ref, index, self) => index === self.findIndex((r) => r.name === ref.name), // 去重
      )

    message.msg.references = validReferences
  } catch (error) {
    console.error('处理引用数据时出错:', error)
  }
}

// 处理本次会话的token统计数据
function processTokenStatData(message, payload) {
  console.log('耗时:', payload.elapsed)
  console.log('token', payload.token_count)
  message.time = payload.elapsed
}

function processErrorData(message, payload) {
  console.log('错误:', payload.error.message)
}

function imgsToMarkdown(imgs) {
  return imgs.map((item) => `![](${item})`).join('\n') + '***'
}

function stopReplyCheck() {
  if (checkReplyInterval) {
    clearInterval(checkReplyInterval)
    checkReplyInterval = null
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
  checkReplyInterval = setInterval(() => {
    const lastMessage = messages.value[lastIndex.value]
    if (lastMessage && lastMessage.msg) {
      const currentReplyLength = lastMessage.msg.reply ? lastMessage.msg.reply.length : 0
      if (currentReplyLength === lastReplyLength.value && currentReplyLength !== 0) {
        handleStop()
      } else {
        lastReplyLength.value = currentReplyLength
      }
    }
  }, 5000)
}

// 用户手动停止生成
function handleStop() {
  try {
    // 停止请求和清理资源
    cleanupRequest()

    // 停止加载状态
    loading.value = false
    stopReplyCheck()

    // 确保当前消息有完整结构
    const currentMessage = messages.value[lastIndex.value]
    if (currentMessage && currentMessage.type === MSG_TYPE.AI) {
      // 如果当前消息没有回复内容，添加一个停止提示
      if (!currentMessage.msg.reply || currentMessage.msg.reply.trim() === '') {
        currentMessage.msg.reply = '已停止生成'
      } else {
        // 如果有内容，在末尾添加停止标记
        currentMessage.msg.reply += '\n\n已手动停止生成'
      }

      // 确保消息结构完整
      if (!currentMessage.msg.thought) {
        currentMessage.msg.thought = ''
      }
      if (!currentMessage.msg.references) {
        currentMessage.msg.references = []
      }

      // 更新消息
      messages.value[lastIndex.value] = currentMessage
    }

    // 滚动到底部
    goBottom()
  } catch (error) {
    console.error('停止生成时出错:', error)
    loading.value = false
    stopReplyCheck()
  }
}

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

// 上传图片
async function uploadImage(sourceType) {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sourceType: [sourceType], // 'camera' 或 'album'
      sizeType: ['compressed'], // 压缩图片
    })
    uploadVisible.value = false
    const { data } = await uploadFile(res.tempFilePaths[0])
    images.value.push(data)
  } catch (error) {
    console.error('图片上传失败:', error)
  }
}

// 删除图片
function delImage(index) {
  try {
    if (index >= 0 && index < images.value.length) {
      images.value.splice(index, 1)
      console.log('删除图片，索引:', index)
    }
  } catch (error) {
    console.error('删除图片时出错:', error)
  }
}

// 切换思考过程的展开/折叠状态
function toggleThought(messageIndex) {
  messages.value[messageIndex].expand = !messages.value[messageIndex].expand
}

onLoad(() => {
  // 初始化SSE处理器
  initSSEHandler()

  // 获取聊天历史数据
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

// 页面返回按钮处理
function goBack() {
  // 如果正在生成中，先停止生成
  if (loading.value) {
    handleStop()
  }
  uni.navigateBack()
}

// 添加页面卸载时的清理逻辑
onUnload(() => {
  cleanupRequest()
  stopReplyCheck()
})

// 显示历史记录（已有占位符）
const show = ref(false)
function close() {
  show.value = false
}
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
        font-size: 40rpx;
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 60rpx;
  margin: 16rpx 0;
}

/* 简约三点动画 */
.thinking-dots {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #6190e8;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%,
  60%,
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
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
  margin-bottom: 16rpx;

  .thought-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8rpx 12rpx;

    .title {
      font-size: 26rpx;
      color: #007aff;
      font-weight: 500;

      .time-info {
        font-size: 22rpx;
        color: #999;
        font-weight: 400;
        margin-left: 8rpx;
      }
    }

    .iconfont {
      font-size: 40rpx;
      transition: transform 0.3s ease;
      transform: rotate(0deg);

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }

  .thought-content {
    border-left: 6rpx solid #e6f2ff;
    padding-left: 20rpx;
    margin-top: 8rpx;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.3s ease-in-out;

    &.show {
      max-height: 2000rpx;
      opacity: 1;
      padding-top: 12rpx;
      padding-bottom: 8rpx;
    }
  }
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

.important-notice {
  margin-top: 20rpx;
  background: #fff7e6;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  border: 1px solid #ffd591;

  .notice-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #fa8c16;
    margin-bottom: 8rpx;
  }

  .notice-content {
    font-size: 24rpx;
    color: #666;
    line-height: 1.5;
  }
}
</style>
