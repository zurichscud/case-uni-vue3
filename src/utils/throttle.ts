let timer: NodeJS.Timeout | null = null
let flag: boolean = false

/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {number} wait 延时的时间
 * @param {boolean} immediate 是否立即执行
 * @returns {void}
 */
function throttle(func: () => void, wait: number = 500, immediate: boolean = true): void {
  if (immediate) {
    if (!flag) {
      flag = true
      // 如果是立即执行，则在wait毫秒内开始时执行
      if (typeof func === 'function') {
        func()
      }
      timer = setTimeout(() => {
        flag = false
      }, wait)
    }
  }
  else if (!flag) {
    flag = true
    // 如果是非立即执行，则在wait毫秒内的结束处执行
    timer = setTimeout(() => {
      flag = false
      if (typeof func === 'function') {
        func()
      }
    }, wait)
  }
}
export default throttle
