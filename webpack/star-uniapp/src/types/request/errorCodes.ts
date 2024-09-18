// 请求错误码

export interface ErrorCode {
  code: string
  message: string
  callback?: () => void
}

export const ERROR_CODES: ErrorCode[] = [
  {
    code: '100002',
    message: '会话过期,请重新登录',
    callback: () => {
      uni.removeStorageSync('sessionId')
      uni.navigateTo({
        url: '/pages/login/login',
      })
    },
  },
]
