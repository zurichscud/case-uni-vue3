import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// 初始化dayjs相对时间插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 格式化时间
export function formatTime(timeStr: string, format: string = 'YYYY-MM-DD') {
  if (!timeStr) {
    return ''
  }
  const now = dayjs()
  const msgTime = dayjs(timeStr)
  const diffInMinutes = now.diff(msgTime, 'minute')
  const diffInHours = now.diff(msgTime, 'hour')
  const diffInDays = now.diff(msgTime, 'day')

  if (diffInMinutes < 1) {
    return '刚刚'
  }
  else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }
  else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }
  else if (diffInDays < 7) {
    return `${diffInDays}天前`
  }
  else {
    return msgTime.format(format)
  }
}
