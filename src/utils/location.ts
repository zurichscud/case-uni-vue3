/**
 * 计算两个经纬度坐标之间的距离
 * @param lat1 第一个点的纬度
 * @param lon1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lon2 第二个点的经度
 * @param formatted 是否返回格式化的距离字符串（带单位）
 * @returns 如果 formatted 为 true，返回带单位的字符串（如 "1.2 km" 或 "800 m"）；否则返回距离（单位：米）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  formatted: boolean = false,
): number | string {
  // 地球半径（米）
  const R = 6371000

  // 将经纬度转换为弧度
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180

  // Haversine 公式
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // 计算距离
  const distance = R * c

  if (formatted) {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`
    }
    return `${Math.round(distance)} m`
  }

  return distance
}

/**
 * 格式化距离显示
 * @param distance 距离（单位：米）
 * @returns 格式化后的距离字符串（如 "1.2 km" 或 "800 m"）
 */
export function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`
  }
  return `${Math.round(distance)} m`
}


