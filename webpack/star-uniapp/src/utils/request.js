import { baseUrl } from './config.ts'
import { globalStore } from '@/store/global'
import { settingStore } from '@/store/setting'
import { storeToRefs } from 'pinia'

export const SUCCESS_CODE_CONFIG = '000000'

export default {
  // 全局配置
  common: {
    baseUrl: baseUrl, //请求地址
    header: {
      'Content-Type': 'application/json',
      // sessionId: '7549f058a845499b82237ce0863d2bfc-17' || uni.getStorageSync('sessionId') || '',
      sessionId: uni.getStorageSync('sessionId'),
    },
    method: 'GET',
    dataType: 'json',
  },
  //正在请求的地址
  loadingArr: [],
  // 加载动画
  loadingNmuber: 0,
  startLoading() {
    if (this.loadingNmuber == 0) {
    }
    this.loadingNmuber++
  },
  endLoading() {
    if (this.loadingNmuber == 0) return
    this.loadingNmuber--
    if (this.loadingNmuber == 0) {
    }
  },
  getPageName(data = {}) {
    //获取当前页面栈的实例

    const { showMenusInfo } = storeToRefs(globalStore())
    const { selectedMenuName } = storeToRefs(settingStore())

    let pages = getCurrentPages()
    //获取当前页面
    let currentPage = pages[pages.length - 1]
    let url = currentPage.route
    //如果当前处于首页，则...

    let userInfo = {}
    if (url.indexOf('/home/') > -1) {
      userInfo.pageOperation = showMenusInfo.value?.name || '未知'
      userInfo.userInfo = `${data.siteId}-null-null`
    } else if (url.indexOf('/management') > -1) {
      let manageLoginUser = uni.getStorageSync('manageLoginUser')
      userInfo.pageOperation = selectedMenuName.value || '未知'
      userInfo.userInfo = `${manageLoginUser.siteId}-${manageLoginUser?.id || null}-${manageLoginUser?.code || null}`
    } else {
      userInfo.pageOperation = '登录'
    }

    return userInfo
  },
  // 请求 返回promise
  request(options = {}) {
    // if(options.data.noLoading!=1){
    // 	this.startLoading();
    // }
    let userInfo = this.getPageName(options?.data)

    let urlBase = this.common.baseUrl
    let serverUrl = uni.getStorageSync('serverUrl')
    if (serverUrl) {
      urlBase = serverUrl
    }
    options.url = urlBase + options.url
    options.timeout = 30000
    options.header = options.header || this.common.header

    options.header.sessionId = uni.getStorageSync('sessionId')
    //options.header.pageOperation = uni.getStorageSync('sessionId')
    options.data = options.data || this.common.data

    options.method = options.method || this.common.method
    options.dataType = options.dataType || this.common.dataType

    if (options.method != 'GET') {
      options.data = {
        ...options.data,
        ...userInfo,
      }
    }

    // let Authorization = uni.getStorageSync('sessionId') || ''
    // if (Authorization) {
    //   options.header.sessionId = Authorization
    // }
    //添加统一header头
    //先判断是哪个界面 然后在根据 url取相对应的选中菜单的ID

    // 处理query参数
    if (options.params) {
      const query = Object.entries(options.params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join('&')
      options.url += `?${query}`
    }

    // 请求
    return new Promise((resolve, reject) => {
      // console.log(options,'接口信息');
      uni.request({
        ...options,
        success: (result) => {
          if (result?.data?.code === '100002') {
            uni.showToast({
              title: result?.data?.msg || '会话过期,请重新登录',
              icon: 'none',
            })

            uni.navigateTo({
              url: '/pages/login/login',
            })
            uni.removeStorageSync('sessionId')
            this.endLoading()
            return
          }
          if (options.url.indexOf('/login-site-new') > -1) {
            let sessionId = result.header.sessionid || result.header.sessionId
            uni.setStorage({
              key: 'sessionId',
              data: sessionId,
              success: function () {
                resolve(result.data)
              },
            })
          } else {
            if (
              result?.data?.code === '000000' ||
              options.errorMsgBool === false
            ) {
              resolve(result.data)
            } else {
              resolve(result.data)
              uni.showToast({
                title: result.data.msg,
                icon: 'none',
              })
            }
          }
          this.endLoading()
        },
        fail: (error) => {
          uni.showToast({
            title: '网络连接失败',
            icon: 'none',
          })
          this.endLoading()
          reject(error)
        },
      })
    })
  },
  // get请求
  get(url, data = {}, errorMsgBool = true, options = {}) {
    options.url = url
    let loginData = uni.getStorageSync('loginData')
    if (loginData?.code) {
      data = { siteId: loginData?.id, ...data }
    }

    options.data = data

    options.method = 'GET'
    options.errorMsgBool = errorMsgBool

    return this.request(options)
  },
  // post请求
  // post(url, data = {}, options = {}) {
  // 	options.url = url
  // 	options.data = data
  // 	options.method = 'POST'
  // 	return this.request(options)
  // },

  // post请求 - 传递query参数
  postWithQuery(url, params = {}, options = {}) {
    options.url = url
    options.method = 'POST'
    options.params = params // 将params参数传递给request方法
    return this.request(options)
  },
  // post请求 - 传递body参数
  post(url, data = {}, errorMsgBool = true, options = {}) {
    options.url = url
    options.method = 'POST'
    let loginData = uni.getStorageSync('loginData')
    if (loginData?.code) {
      data = { siteId: loginData?.id, addressId: loginData?.addressId, ...data }
    }
    options.data = data // 将data参数传递给request方法

    options.errorMsgBool = errorMsgBool

    return this.request(options)
  },
  // delete请求
  del(url, data = {}, errorMsgBool = true, options = {}) {
    options.url = url
    options.data = data
    options.method = 'DELETE'
    options.errorMsgBool = errorMsgBool

    return this.request(options)
  },
  // options请求
  options(url, data = {}, errorMsgBool = true, options = {}) {
    options.url = url
    options.data = data
    options.method = 'options'
    options.errorMsgBool = errorMsgBool

    return this.request(options)
  },
  // put请求
  put(url, data = {}, errorMsgBool = true, options = {}) {
    options.url = url
    options.data = data
    options.method = 'put'
    options.errorMsgBool = errorMsgBool

    return this.request(options)
  },
  // head请求
  head(url, data = {}, errorMsgBool = true, options = {}) {
    options.url = url
    options.data = data
    options.method = 'head'
    options.errorMsgBool = errorMsgBool

    return this.request(options)
  },
  // trace请求
  trace(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'trace'
    return this.request(options)
  },
  // connect请求
  connect(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'connect'
    return this.request(options)
  },
}
