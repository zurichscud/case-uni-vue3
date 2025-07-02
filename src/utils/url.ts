/**
 * 查询参数对象类型
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined | null
}

/**
 * 将对象转换为查询参数字符串
 * @param params 参数对象
 * @returns 查询参数字符串（不包含?前缀）
 */
export function objectToQueryString(params: QueryParams): string {
  const queryParts: string[] = []

  for (const [key, value] of Object.entries(params)) {
    // 跳过 undefined 和 null 值
    if (value === undefined || value === null) {
      continue
    }

    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(String(value))
    queryParts.push(`${encodedKey}=${encodedValue}`)
  }

  return queryParts.join('&')
}

/**
 * 拼接URL和查询参数
 * @param url 基础URL
 * @param params 查询参数对象
 * @returns 拼接后的完整URL
 */
export function appendQueryParams(url: string, params: QueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    return url
  }

  const queryString = objectToQueryString(params)

  if (!queryString) {
    return url
  }

  // 判断URL是否已经包含查询参数
  const separator = url.includes('?') ? '&' : '?'

  return `${url}${separator}${queryString}`
}

/**
 * 从URL中提取查询参数
 * @param url 完整URL或查询字符串
 * @returns 查询参数对象
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}

  // 提取查询字符串部分
  const queryString = url.includes('?') ? url.split('?')[1] : url

  if (!queryString) {
    return params
  }

  // 分割参数
  const pairs = queryString.split('&')

  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : ''
    }
  }

  return params
}

/**
 * 更新URL中的查询参数
 * @param url 原始URL
 * @param params 要更新的参数对象
 * @returns 更新后的URL
 */
export function updateQueryParams(url: string, params: QueryParams): string {
  const [baseUrl] = url.split('?')
  const existingParams = parseQueryParams(url)

  // 合并现有参数和新参数
  const mergedParams = { ...existingParams, ...params }

  return appendQueryParams(baseUrl, mergedParams)
}

/**
 * 从URL中移除指定的查询参数
 * @param url 原始URL
 * @param keys 要移除的参数键名数组
 * @returns 移除参数后的URL
 */
export function removeQueryParams(url: string, keys: string[]): string {
  const [baseUrl] = url.split('?')
  const existingParams = parseQueryParams(url)

  // 移除指定的参数
  keys.forEach((key) => {
    delete existingParams[key]
  })

  return appendQueryParams(baseUrl, existingParams)
}
