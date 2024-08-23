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
  // 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
  uni.$u.setConfig({
    // 修改$u.config对象的属性
    config: {
      // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
      unit: 'rpx',
    },
    // 修改$u.props对象的属性
    props: {
      // 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
      radio: {
        size: 15,
      },
      // 其他组件属性配置
      // ......
    },
  })
  // 设置 showToast 的默认时间 5000
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
