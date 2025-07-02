import http from '@/utils/http'

//获取所有消息列表
export function getUnReadMessage(data) {
  return http({
    url: 'iclaim/caseMessage/getList',
    method: 'GET',
    data,
  })
}

//获取机器人消息
export function getRobotMessage(data) {
  return http({
    url: '/newCase/question/list',
    method: 'GET',
    data,
  })
}
