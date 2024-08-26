/*
 * @Description:
 * @Author: shuliang
 * @Date: 2022-06-21 15:58:08
 * @LastEditTime: 2022-08-18 17:14:23
 * @LastEditors: shuliang
 */
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  uni.getSystemInfo({
    success: function (e: any) {
      // #ifndef MP
      app.config.globalProperties.$StatusBar = e.statusBarHeight
      if (e.platform == 'android') {
        app.config.globalProperties.$CustomBar = e.statusBarHeight + 50
      } else {
        app.config.globalProperties.$CustomBar = e.statusBarHeight + 45
      }
      // #endif

      // #ifdef MP-

      app.config.globalProperties.$StatusBar = e.statusBarHeight
      const custom = wx.getMenuButtonBoundingClientRect()
      app.config.globalProperties.$Custom = custom
      app.config.globalProperties.$CustomBar =
        custom.bottom + custom.top - e.statusBarHeight
      // #endif

      //窗口高度
      app.config.globalProperties.$windowHeight = e.windowHeight
      //获取导航高度
      app.config.globalProperties.$navHeight =
        e.statusBarHeight * (750 / e.windowWidth) + 91
      app.config.globalProperties.$SystemInfo = e
    },
  })

  // 设置 showToast 的默认时间 3000
  const originalShowToast = uni.showToast
  uni.showToast = (params: object) => {
    originalShowToast({
      duration: 3000,
      icon: 'none',
      ...params,
    })
  }

  return {
    app,
  }
}
