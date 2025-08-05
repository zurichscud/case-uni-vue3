// 工具函数：Base64 转临时路径
export function base64ToPath(base64) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = base64.match(/^data:image\/(\w+);base64,(.*)$/) || []
    if (!format) reject(new Error('BASE64 格式错误'))

    const filePath = `${wx.env.USER_DATA_PATH}/${Date.now()}.${format}`
    const fs = uni.getFileSystemManager()

    fs.writeFile({
      filePath,
      data: bodyData,
      encoding: 'base64',
      success: () => resolve(filePath),
      fail: reject,
    })
  })
}
