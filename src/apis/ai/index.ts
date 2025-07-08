import http from '@/utils/http'

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
    url: '/chat-room/delete',
    method: 'DELETE',
    data,
  })
}
