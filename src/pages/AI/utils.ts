/**
 * AI聊天页面工具函数
 *
 * SSEHandler使用示例：
 *
 * ```typescript
 * import { SSEHandler } from './utils'
 *
 * // 创建SSE处理器实例
 * const sseHandler = new SSEHandler({
 *   onEvent: (eventType, parsedData) => {
 *     console.log('接收到事件:', eventType, parsedData)
 *     // 处理不同类型的事件
 *     switch(eventType) {
 *       case 'reply':
 *         handleReply(parsedData)
 *         break
 *       case 'thought':
 *         handleThought(parsedData)
 *         break
 *       case 'reference':
 *         handleReference(parsedData)
 *         break
 *     }
 *   },
 *   onError: (error) => {
 *     console.error('SSE处理错误:', error)
 *     // 处理错误
 *   },
 *   onComplete: () => {
 *     console.log('SSE处理完成')
 *     // 清理资源
 *   },
 *   debug: true // 开发时启用调试
 * })
 *
 * // 在uni.request的onChunkReceived中使用
 * requestTask.onChunkReceived((chunk) => {
 *   sseHandler.handleData(chunk.data)
 * })
 *
 * // 清理资源
 * sseHandler.clear()
 * ```
 */
import type { SSEHandlerOptions } from './types'

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


// 通用SSE数据处理器
export class SSEHandler {
  private partialDataBuffer: string = ''

  private options: SSEHandlerOptions

  constructor(options: SSEHandlerOptions = {}) {
    this.options = {
      debug: false,
      ...options,
    }
  }

  /**
   * 处理SSE数据流
   * @param data - 接收到的数据
   */
  handleData(data: ArrayBuffer | Uint8Array): void {
    try {
      // 将接收到的数据转换为字符串
      const uint8Array = data instanceof ArrayBuffer ? new Uint8Array(data) : data
      const newDataChunk = bufferToUtf8(uint8Array)

      // if (this.options.debug) {
      //   console.log('SSE接收到数据块:', newDataChunk)
      // }

      // 数据可能不完整，需要缓冲区拼接
      this.partialDataBuffer += newDataChunk

      // 处理缓冲区中的完整SSE事件
      this.processBuffer()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error('处理SSE数据时出错:', err)
      this.options.onError?.(err)
    }
  }

  /**
   * 处理SSE缓冲区数据
   */
  private processBuffer(): void {
    try {
      // 按双换行符分割事件
      const events = this.partialDataBuffer.split('\n\n')

      // 处理最后一个可能不完整的事件
      this.partialDataBuffer = events.pop() || ''

      // 处理完整的事件
      events.forEach((eventData) => {
        if (eventData.trim()) {
          this.parseAndHandleEvent(eventData)
        }
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error('处理SSE缓冲区时出错:', err)
      this.options.onError?.(err)
    }
  }

  /**
   * 解析并处理单个SSE事件
   */
  private parseAndHandleEvent(eventData: string): void {
    try {
      const result = parseSSEEvent(eventData)

      if (result && result.length === 2) {
        const [eventType, parsedData] = result

        if (this.options.debug) {
          console.log('SSE事件解析成功:', { eventType, parsedData })
        }

        // 调用事件处理回调
        this.options.onEvent?.(eventType, parsedData)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error('解析SSE事件时出错:', err)
      this.options.onError?.(err)
    }
  }

  /**
   * 清理缓冲区
   */
  clear(): void {
    this.partialDataBuffer = ''
    if (this.options.debug) {
      console.log('SSE缓冲区已清理')
    }
  }

  /**
   * 获取当前缓冲区内容（用于调试）
   */
  getBufferContent(): string {
    return this.partialDataBuffer
  }

  /**
   * 标记处理完成
   */
  complete(): void {
    this.options.onComplete?.()
    this.clear()
  }

  /**
   * 更新配置选项
   */
  updateOptions(newOptions: Partial<SSEHandlerOptions>): void {
    this.options = { ...this.options, ...newOptions }
  }
}
