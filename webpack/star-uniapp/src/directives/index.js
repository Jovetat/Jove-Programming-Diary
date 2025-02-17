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
const lazyDirective = {
  mounted(el, binding) {
    const pic_src = binding.value

    const obServer = new IntersectionObserver((entries) => {
      // 如果 intersectionRatio 为 0，则目标在视野外
      if (entries.find((v) => v.intersectionRatio)) {
        el.querySelector('div').style.backgroundImage = `url(${pic_src})`
        obServer.unobserve(el)
      }
    })
    obServer.observe(el)
  },
}

export default {
  install(app) {
    app.directive('throttle', throttleDirective)
    app.directive('lazy-load', lazyDirective)
  },
}
