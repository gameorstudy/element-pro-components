export function generateCryptoUID() {
  // 浏览器环境
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // 兼容方案
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  
  // 转换为16进制字符串
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
