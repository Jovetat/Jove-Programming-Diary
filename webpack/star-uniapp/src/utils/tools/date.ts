// 获取各种日期格式
import dayjs from 'dayjs'

// 获取当前时间，格式为 YYYY-MM-DD
export const getCurrentDate = (): string => {
  return dayjs().format('YYYY-MM-DD')
}
