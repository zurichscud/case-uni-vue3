export function bufferToUtf8(buffer: Uint8Array) {
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



// 解析单个SSE事件
export function parseSSEEvent(eventData: string) {
  try {
    const lines = eventData.trim().split('\n')
    let eventType = ''
    let data = ''

    // 解析SSE事件格式
    lines.forEach((line) => {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        data = line.slice(5).trim()
      }
    })

    if (!eventType || !data) {
      console.log('跳过不完整的SSE事件:', eventData)
      return
    }

    // console.log('解析SSE事件:', { eventType, data })

    // 解析JSON数据
    let parsedData
    try {
      parsedData = JSON.parse(data)
    } catch (jsonError) {
      console.error('JSON解析失败:', jsonError, 'data:', data)
      return
    }

    return [eventType, parsedData]
  } catch (error) {
    console.error('解析SSE事件时出错:', error)
  }
}
