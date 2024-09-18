export const throttle = (func: Function, delay: number = 1000) => {
  let isThrottled = false
  return (...args: any[]) => {
    if (!isThrottled) {
      func(...args) // 立即执行函数
      isThrottled = true // 标记为已触发

      setTimeout(() => {
        isThrottled = false // 延迟结束后重置标志，允许下一次触发
      }, delay)
    }
  }
}
