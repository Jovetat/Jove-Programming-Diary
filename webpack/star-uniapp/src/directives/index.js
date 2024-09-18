const throttleDirective = {
  mounted(el, binding) {
    const { handler, delay = 1500 } = binding.value || {}
    let lastClickTime = 0
    el.addEventListener('click', (event) => {
      const now = Date.now()
      if (now - lastClickTime >= delay) {
        // 超过节流时间间隔，执行点击事件处理程序
        handler(event)
        lastClickTime = now
      }
    })
  },
}

export default {
  install(app) {
    app.directive('throttle', throttleDirective)
  },
}
