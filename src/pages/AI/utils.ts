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
