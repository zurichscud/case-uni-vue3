import http from '@/utils/http'

interface MessageParams {
  userId: number
  category: 0
  pageNum: number
  pageSize: number
}

//获取未读消息列表
export function getUnReadMessage(data:any) {
  return http({
    url: 'iclaim/caseMessage/getList',
    method: 'GET',
    data,
  })
}

//获取机器人消息
export function getRobotMessage(data:any) {
  return http({
    url: '/newCase/question/list',
    method: 'GET',
    data,
  })
}

//获取消息列表，只要调用，消息就会变为已读
export function getMessageList(data:MessageParams) {
  return http({
    url: 'iclaim/caseMessage/getSystemMessage',
    method: 'GET',
    data,
  })
}
