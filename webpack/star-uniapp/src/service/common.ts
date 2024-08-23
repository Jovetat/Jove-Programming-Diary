import request, { SUCCESS_CODE_CONFIG } from '@/utils/request.js'
export const SUCCESS_CODE = SUCCESS_CODE_CONFIG

export function loginSite(data: object) {
  return request.post('/business/sys-site/login-site-new', data)
}

export function clockInList(data: object) {
  return request.get('/business/sys-user/get-clock-userid', data)
}
