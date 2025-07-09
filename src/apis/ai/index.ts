import http from '@/utils/http'
import { appendQueryParams } from '@/utils/url'
interface History {
  sessionId: string//会话id
  content: string//对话标题（通常是用户第一个问的问题）
}

//获取历史会话
export function getChatHistory(data: { userId: string }) {
  return http({
    url: '/chat-room/all-session',
    method: 'GET',
    data
  })
}

//删除会话
//TODO: 需要修改
export function deleteChatHistory(data: { sessionId: string }) {
  return http({
    url: appendQueryParams('/chat-room/delete', data),
    method: 'DELETE',
  })
}


export function getReasonList(data: { dictType: string }) {
  return http({
    url: '/chat-room/getQuestionList',
    method: 'POST',
    data,
  })
}

export function addFeedback(data: { userId: string, question: string, targetQuestion: string, targetAnswer: string, targetFormat: string, supplement: string }) {
  return http({
    url: '/chat-room/addQuestion',
    method: 'POST',
    data,
  })
}
