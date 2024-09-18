// 获取地址栏参数
export function getQueryParam(url: any) {
  let qs = url.split('?')[1]
  let arr = []
  let res: any = {}
  if (!qs) {
    // return res;
  } else {
    arr = qs.split('&')
    for (let i = 0, len = arr.length; i < len; i++) {
      let key = arr[i].split('=')[0]
      let val = arr[i].split('=')[1]
      res[key] = decodeURIComponent(val)
    }
  }
  return res
}

// 获取页面路由传参
export const useAllRouteParams = (history: number = 1) => {
  let pages = getCurrentPages()
  if (!pages || pages.length < history) {
    return {} // 页面栈不足或不存在时返回空对象
  }
  let currentPage: any = pages[pages.length - history]

  if (currentPage && currentPage.$page && currentPage.$page.options) {
    return currentPage.$page.options // 返回当前页面的参数
  }
  return {}
}
