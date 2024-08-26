import { baseUrl } from './config.ts'
import { ERROR_CODES } from '@/types/errorCodes.js'

export const SUCCESS_CODE_CONFIG = '000000'

export default {
  // 全局配置
  common: {
    baseUrl: baseUrl, // 请求地址
    header: {
      'Content-Type': 'application/json',
      sessionId: uni.getStorageSync('sessionId'),
    },
    method: 'GET',
    dataType: 'json',
  },
  // 请求 返回promise
  request(options = {}) {
    options.url = this.common.baseUrl + options.url
    options.timeout = 30000
    options.header = options.header || this.common.header
    options.header.sessionId = uni.getStorageSync('sessionId')
    options.method = options.method || this.common.method
    options.dataType = options.dataType || this.common.dataType

    // 处理 query 参数
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
      uni.request({
        ...options,
        success: (result) => {
          const code = result?.data?.code ?? '999999'
          if (code === SUCCESS_CODE_CONFIG) {
            return resolve(result.data)
          }
          const errorCode = ERROR_CODES.find((ec) => ec.code === code)
          if (errorCode) {
            uni.showToast({
              title: errorCode.message,
              icon: 'none',
            })
            errorCode.callback && errorCode.callback()
            reject(result.data)
          }
        },
        fail: (error) => {
          uni.showToast({
            title: '网络连接失败',
            icon: 'none',
          })
          reject(error)
        },
      })
    })
  },
  // GET 请求
  get(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  },
  // POST 请求 - 传递 body 参数
  post(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  },
  // DELETE 请求
  del(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'DELETE'
    return this.request(options)
  },
  // PUT 请求
  put(url, data = {}, options = {}) {
    options.url = url
    options.data = data
    options.method = 'PUT'
    return this.request(options)
  },
}
