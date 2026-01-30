export const debounce = (func, delay = 150) => {
  let timeout
  const debounced = (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }

  // 添加取消方法
  debounced.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  }

  return debounced
}
