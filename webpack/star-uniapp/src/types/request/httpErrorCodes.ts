// http 错误码

export const HTTP_ERROR_CODES = [
  {
    code: 400,
    message: '请求错误：服务器无法理解请求的格式',
    callback: () => {
      console.log('400错误处理')
    },
  },
  {
    code: 401,
    message: '未授权：请求要求用户认证',
    callback: () => {
      console.log('401错误处理')
    },
  },
  {
    code: 403,
    message: '禁止访问：服务器拒绝请求',
    callback: () => {
      console.log('403错误处理')
    },
  },
  {
    code: 404,
    message: '未找到：服务器找不到请求的资源',
    callback: () => {
      console.log('404错误处理')
    },
  },
  {
    code: 405,
    message: '方法不允许：请求中指定的方法不被允许',
    callback: () => {
      console.log('405错误处理')
    },
  },
  {
    code: 408,
    message: '请求超时：服务器等待请求超时',
    callback: () => {
      console.log('408错误处理')
    },
  },
  {
    code: 429,
    message: '请求过多：客户端发送的请求过多',
    callback: () => {
      console.log('429错误处理')
    },
  },
  {
    code: 500,
    message: '服务器错误：服务器遇到错误，无法完成请求',
    callback: () => {
      console.log('500错误处理')
    },
  },
  {
    code: 502,
    message: '网关错误：服务器作为网关或代理，从上游服务器收到无效响应',
    callback: () => {
      console.log('502错误处理')
    },
  },
  {
    code: 503,
    message: '服务不可用：服务器暂时过载或维护，无法处理请求',
    callback: () => {
      console.log('503错误处理')
    },
  },
  {
    code: 504,
    message: '网关超时：服务器作为网关或代理，未能及时从上游服务器获取请求',
    callback: () => {
      console.log('504错误处理')
    },
  },
]
