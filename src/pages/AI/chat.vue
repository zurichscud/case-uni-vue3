<!-- 弈寻deepseek -->
<template>
  <!-- AI聊天主页面 -->
  <view class="main">
    <!-- 顶部导航栏 -->
    <view class="top_nav" :style="{
      top: menuButtonInfo.top + 'px',
      height: menuButtonInfo.height + 'px',
    }">
      <view class="left">
        <!-- 返回按钮 -->
        <i class="iconfont icon-jiantou_liebiaoxiangzuo" @click="handleBack" size="20"></i>
        <!-- 历史记录按钮 -->
        <i class="iconfont icon-liebiao" @click="showHistoryDrawer = true" size="20"></i>
        <i class="iconfont icon-a-kaiqixinhuihua-L1" @click="handleNewChat"></i>
      </view>
      <view class="title">弈寻</view>
      <view :style="wxMenu"></view>
    </view>

    <!-- 聊天消息滚动区域 -->
    <scroll-view scroll-y="true" class="scroll" :scroll-top="scrollTop" :scroll-with-animation="true" :style="{
      paddingBottom: `calc(${keyboardHeight}px + 204rpx)`,
      paddingTop: `calc(${menuButtonInfo.top + menuButtonInfo.height}px + 20rpx)`,
    }">
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
                  <i class="iconfont icon-jiantou_liebiaozhankai" :class="{ expanded: item.expand }"></i>
                </view>
                <!-- 思考过程内容 -->
                <view class="thought-content" :class="{ show: item.expand }">
                  <MarkdownRenderer :content="item.msg.thought" font-size="26rpx" text-color="#7d7d7d"
                    line-height="1.5"></MarkdownRenderer>
                </view>
              </view>
              <!-- AI回复内容 -->
              <view class="reply" v-if="item.msg.reply">
                <MarkdownRenderer :content="item.msg.reply" font-size="28rpx" text-color="#333" line-height="1.6">
                </MarkdownRenderer>
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
              <view class="important-notice" v-if="item.msg.reply && !(index === lastIndex && loading)">
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
                  <text class="iconfont icon-cai" @click="handleFeedback(messages[index].traceId)"></text>
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
              <image :src="item.msg" style="width: 500rpx" mode="widthFix" v-if="item.isImage"></image>
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

      <!-- 消息输入框容器 -->
      <view class="input_container">
        <!-- 输入框 -->
        <textarea class="chat_input" auto-height :maxlength="maxLength" :adjust-position="false"
          :show-confirm-bar="false" v-model="userInput" :placeholder="inputLength === 0 ? '输入您的问题...' : ''"
          @confirm="handleSend" :class="{
            'has-counter': inputLength > 0,
          }" />

        <!-- 字符计数 -->
        <view class="input_counter" v-if="inputLength > 0">
          <text class="counter_text" :class="{
            warning: inputLength > maxLength * 0.8,
            error: inputLength >= maxLength,
          }">
            {{ inputLength }}/{{ maxLength }}
          </text>
        </view>
      </view>

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
          <view class="btn-ra closeempty" :style="{ transform: uploadVisible ? 'rotate(0)' : 'rotate(45deg)' }"
            @click="uploadVisible = !uploadVisible">
            <text class="iconfont icon-closeempty"></text>
          </view>
          <!-- 停止生成按钮（生成中显示） -->
          <view class="btn-ra up" @click="handleStop" v-if="loading">
            <text class="iconfont icon-stop"></text>
          </view>
          <!-- 发送消息按钮 -->
          <view class="btn-ra up" @click="optimizedSend" v-else :class="{
            disabled: !canSend,
          }">
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

    <!-- 历史记录抽屉组件 -->
    <HistoryDrawer v-model="showHistoryDrawer" :current-session-id="sessionId" @select-history="handleSelectHistory"
      @new-chat="handleNewChat" />

    <!-- 消息反馈组件 -->
    <Feedback ref="FeedbackRef"></Feedback>
  </view>
</template>

<script setup>
  import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
  import Feedback from './components/Feedback.vue'
  import HistoryDrawer from './components/HistoryDrawer.vue'
  import MarkdownRenderer from '@/components/MarkdownRenderer/MarkdownRenderer.vue'
  import { nextTick, ref, computed } from 'vue'
  import * as AIAPI from '@/apis/ai'
  import { useUserStore } from '@/stores'
  import { END_TEXT, AI_AVATAR, AI_INTRODUCTION, AI_HELLO } from './data'
  import { SSEHandler, imgsToMarkdown } from './utils'
  import { uploadFile } from '@/utils/http'

  const userStore = useUserStore()
  const keyboardHeight = ref(0)
  const scrollTop = ref(0)
  const userInput = ref('') //输入框内容
  const images = ref([])
  const messages = ref([])
  const lastIndex = computed(() => messages.value.length - 1)
  const loading = ref(false)

  const maxLength = 1000 // 最大输入长度
  const inputLength = computed(() => userInput.value.length) // 当前输入长度
  const canSend = computed(() => userInput.value.trim().length > 0 && !loading.value) // 是否可以发送
  let checkReplyInterval = null //检查回复长度
  const lastReplyLength = ref(0)
  const thinkText = ref('已深度思考')
  const FeedbackRef = ref()
  const showHistoryDrawer = ref(false) // 控制历史记录抽屉显示
  const MSG_TYPE = {
    AI: 0,
    USER: 1,
  }
  let requestTask = null
  let sessionId = ''
  const uploadVisible = ref(false)
  let sseHandler = null //SSE处理器实例
  const { top, height, width } = uni.getMenuButtonBoundingClientRect()
  const menuButtonInfo = ref({
    top: top,
    height: height,
  })
  const wxMenu = {
    width: width + 'px',
  }

  // 页面返回按钮处理
  function handleBack() {
    // 如果正在生成中，先停止生成
    if (loading.value) {
      handleStop()
    }
    uni.navigateBack()
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

  function handleFeedback(traceId) {
    FeedbackRef.value.open(traceId)
  }

  async function handleSend() {
    // 验证输入内容
    if (!userInput.value.trim()) {
      uni.showToast({
        title: '请输入问题',
        icon: 'none',
      })
      return
    }

    // 检查是否超过最大长度
    if (userInput.value.length > maxLength) {
      uni.showToast({
        title: `输入内容不能超过${maxLength}个字符`,
        icon: 'none',
      })
      return
    }

    // 防止重复发送
    if (loading.value) {
      uni.showToast({
        title: '正在生成回复中...',
        icon: 'none',
      })
      return
    }

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
      // 保存当前的图片数组，用于构建请求数据
      const currentImages = [...images.value]

      // 构建请求数据
      const requestData = {
        question: currentImages.length ? imgsToMarkdown(currentImages) + userMessage : userMessage,
        sessionId,
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

      // 更新sessionId
      if (payload.session_id) {
        sessionId = payload.session_id
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
        message.traceId = payload.trace_id
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

  // 从markdown中提取图片URL
  function extractImageUrls(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return []
    }

    // 匹配markdown图片格式 ![](url)
    const imageRegex = /!\[.*?\]\((.*?)\)/g
    const urls = []
    let match

    while ((match = imageRegex.exec(markdown)) !== null) {
      const url = match[1]
      if (url && url.trim()) {
        urls.push(url.trim())
      }
    }

    return urls
  }

  // 将历史记录转换为当前消息格式
  function convertHistoryToMessages(historyData) {
    if (!historyData || !Array.isArray(historyData)) {
      console.warn('历史记录数据格式不正确:', historyData)
      return []
    }

    // 按时间排序（确保消息顺序正确）
    const sortedHistory = historyData.reverse()

    return sortedHistory.flatMap((item) => {
      if (item.type === MSG_TYPE.USER) {
        const userMessage = item.content.split('***')
        //存在图片
        if (userMessage.length > 1) {
          const imgMarkdown = userMessage[0]
          const text = userMessage[1]

          const messages = []

          // 解析图片markdown，提取图片URL
          if (imgMarkdown && imgMarkdown.trim()) {
            const imgUrls = extractImageUrls(imgMarkdown)
            imgUrls.forEach((url) => {
              messages.push({
                type: MSG_TYPE.USER,
                msg: url,
                isImage: true,
              })
            })
          }

          // 添加文本消息（如果有文本内容）
          if (text && text.trim()) {
            messages.push({
              type: MSG_TYPE.USER,
              msg: text.trim(),
              isImage: false,
            })
          }

          return messages
        } else {
          //纯文本消息
          return [
            {
              type: MSG_TYPE.USER,
              msg: item.content || '',
              isImage: false,
            },
          ]
        }
      } else {
        // 处理引用文献数据
        let references = []
        if (item.reference) {
          if (Array.isArray(item.reference)) {
            // 直接是数组
            references = item.reference
          } else if (typeof item.reference === 'string') {
            // 如果是字符串，尝试解析为JSON
            try {
              const parsed = JSON.parse(item.reference)
              if (Array.isArray(parsed)) {
                // 处理解析后的数组
                references = parsed
                  .map((ref) => {
                    // 检查每个元素的类型
                    if (typeof ref === 'string') {
                      // 如果是字符串，尝试再次解析
                      try {
                        return JSON.parse(ref)
                      } catch (e) {
                        console.warn('无法解析引用文献字符串:', ref)
                        return null
                      }
                    } else if (typeof ref === 'object' && ref !== null) {
                      // 如果已经是对象，直接使用
                      return ref
                    }
                    return null
                  })
                  .filter((ref) => ref !== null && ref.name) // 过滤掉null和没有name字段的对象
              } else {
                references = []
              }
            } catch (e) {
              console.warn('无法解析引用文献数据:', item.reference)
              references = []
            }
          }
        }

        return [
          {
            type: MSG_TYPE.AI,
            expand: true, // 默认展开思考过程
            time: 0,
            traceId: item.id, // 使用历史记录ID作为traceId
            msg: {
              reply: item.content || '',
              thought: item.thought || '',
              references: references,
            },
          },
        ]
      }
    })
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

  // 历史记录相关事件处理
  async function handleSelectHistory(item) {
    console.log('选择历史记录:', item)

    try {
      // 停止当前生成（如果有）
      if (loading.value) {
        handleStop()
      }

      // 加载历史对话
      sessionId = item.sessionId
      const { data } = await AIAPI.getChatHistory({ sessionId: item.sessionId })
      console.log('历史记录:', data)

      // 转换历史记录为当前消息格式
      const convertedMessages = convertHistoryToMessages(data)

      // 更新消息列表
      messages.value = convertedMessages

      // 重置输入状态
      userInput.value = ''
      images.value = []
      uploadVisible.value = false
      loading.value = false
      stopReplyCheck()

      // 关闭历史记录抽屉
      showHistoryDrawer.value = false

      // 滚动到底部
      goBottom()
    } catch (error) {
      console.error('加载历史记录失败:', error)
    }
  }

  function handleNewChat() {
    console.log('新建对话')
    if (sessionId === '') {
      uni.showToast({
        title: '已在最新对话中',
        icon: 'none',
      })
    }
    // 重置当前会话
    sessionId = ''
    messages.value = []
    userInput.value = ''
    images.value = []
    uploadVisible.value = false
    loading.value = false
    stopReplyCheck()

    // 滚动到顶部
    scrollTop.value = 0
  }

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

        // 给用户反馈
        uni.showToast({
          title: '图片已删除',
          icon: 'none',
          duration: 1000,
        })
      }
    } catch (error) {
      console.error('删除图片时出错:', error)
      uni.showToast({
        title: '删除图片失败',
        icon: 'none',
      })
    }
  }

  // 切换思考过程的展开/折叠状态
  function toggleThought(messageIndex) {
    messages.value[messageIndex].expand = !messages.value[messageIndex].expand
  }

  // 提供触感反馈
  function hapticFeedback() {
    try {
      uni.vibrateShort({
        type: 'light',
      })
    } catch (e) {
      console.log('触感反馈不支持')
    }
  }

  // 优化的发送处理
  async function optimizedSend() {
    if (canSend.value) {
      hapticFeedback()
      await handleSend()
    }
  }

  onLoad(() => {
    initSSEHandler()
  })

  onShow(() => {
    uni.onKeyboardHeightChange((res) => {
      keyboardHeight.value = res.height
      goBottom()
    })
  })

  onUnload(() => {
    cleanupRequest()
    stopReplyCheck()
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    .item {
      width: 48%;
      opacity: 0;
      transform: translateY(20rpx);
      animation: slideUp 0.3s ease forwards;

      &:nth-child(1) {
        animation-delay: 0.1s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      .btn {
        height: 180rpx;
        border-radius: 30rpx;
        background-color: #f5f5f5;
        text-align: center;
        line-height: 180rpx;
        transition: all 0.3s ease;

        .iconfont {
          font-size: 40rpx;
          transition: all 0.3s ease;
        }

        &:active {
          background-color: #e8e8e8;
          transform: scale(0.95);

          .iconfont {
            transform: scale(1.1);
          }
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

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    border-bottom: 2rpx solid #fafafa;
    background-color: #fefefe;
    position: fixed;
    left: 0;
    right: 0;

    .left {
      display: flex;
      align-items: center;
      gap: 20rpx; // 图标间距

      .iconfont {
        font-size: 50rpx;
      }
    }

    .title {
      font-size: 36rpx;
      font-weight: 600;
      letter-spacing: 1rpx;
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
          transition: all 0.3s ease;

          &:active {
            transform: scale(0.95);
            background-color: #d1e7ff;
          }
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

            &:active {
              transform: rotate(45deg) scale(0.9);
            }
          }

          .up {
            color: #fff;
            background-color: #3b84f5;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;

            &.disabled {
              background-color: #d9d9d9;
              color: #999;
              cursor: not-allowed;
            }

            &:active:not(.disabled) {
              transform: scale(0.95);
            }
          }
        }

        .deep {
          margin-left: 12rpx;
        }
      }

      .input_container {
        position: relative;
        margin-top: 17rpx;
      }

      .chat_input {
        width: 100%;
        min-height: 80rpx;
        background-color: #f8f8f8;
        border-radius: 40rpx;
        padding: 20rpx 30rpx;
        font-size: 26rpx;
        border: 2rpx solid transparent;
        transition: all 0.3s ease;
        line-height: 1.5;
        box-sizing: border-box;
        resize: none;
        outline: none;

        /* 当有计数器显示时，调整底部边距 */
        &.has-counter {
          padding-bottom: 50rpx;
        }

        &::placeholder {
          color: #999;
        }
      }

      .input_counter {
        position: absolute;
        bottom: 12rpx;
        right: 20rpx;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20rpx;
        padding: 4rpx 12rpx;
        backdrop-filter: blur(4px);
        z-index: 10;

        .counter_text {
          font-size: 22rpx;
          color: #666;

          &.warning {
            color: #fa8c16;
          }

          &.error {
            color: #f5222d;
          }
        }
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

  /* 历史记录样式已迁移到HistoryDrawer组件中 */

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

<route lang="json">{
  "name": "chat",
  "style": {
    "navigationBarTitleText": "弈寻",
    "enablePullDownRefresh": false,
    "navigationStyle": "custom"
  }
}</route>
