import http from '@/utils/http'
import { appendQueryParams } from '@/utils/url'
interface History {
  sessionId: string//会话id
  content: string//对话标题（通常是用户第一个问的问题）
}

export interface FeedbackParams{
  userId: string
  question: string
  targetQuestion: string
  targetAnswer: string
  targetFormat: string
  supplement: string
}

//获取历史会话
export function getSessionList(data: { userId: string }) {
  return http({
    url: '/chat-room/all-session',
    method: 'GET',
    data
  })
}

//删除会话
export function deleteChatHistory(data: { sessionId: string }) {
  return http({
    url: appendQueryParams('/chat-room/delete', data),
    method: 'DELETE',
  })
}


//获取反馈原因列表
export function getReasonList(data: { dictType: string }) {
  return http({
    url: '/chat-room/getQuestionList',
    method: 'POST',
    data,
  })
}

//添加反馈
export function addFeedback(data: FeedbackParams) {
  return http({
    url: '/chat-room/addQuestion',
    method: 'POST',
    data,
  })
}

//获取会话内容
export function getChatHistory(data: { sessionId: string }) {
  return http({
    url: '/chat-room/session',
    method: 'GET',
    data,
  })
}
