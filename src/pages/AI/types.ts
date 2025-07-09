// SSE处理器接口类型定义
export interface SSEHandlerOptions {
  onEvent?: (eventType: string, parsedData: any) => void
  onError?: (error: Error) => void
  onComplete?: () => void
  debug?: boolean
}
