// 保留两位小数
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) {
    return ''
  }
  const formattedPrice = strictRound(numPrice)
  return formattedPrice
}

// 严格四舍五入，toFixed并非严格四舍五入，5.555会变成5.55
export const strictRound = (
  value: string | number,
  decimalPlaces: number = 2,
): string => {
  const num = parseFloat(value as string)
  if (isNaN(num)) {
    return ''
  }
  const multiplier = Math.pow(10, decimalPlaces)
  const roundedNum = Math.round(num * multiplier) / multiplier
  return roundedNum.toFixed(decimalPlaces)
}

// 转换为百分比
export const toPercentage = (value: number | string): string => {
  if (typeof value === 'number') {
    return `${value * 100}%`
  } else if (typeof value === 'string') {
    const parsedValue = parseFloat(value)
    if (!isNaN(parsedValue)) {
      return `${parsedValue * 100}%`
    }
  }
  return '0%'
}

//将对象转换为地址栏参数
export function setQueryParam(obj: any) {
  if (!obj && !Object.keys(obj).length) {
    return ''
  } else {
    let arr = []
    for (let key in obj) {
      arr.push(key + '=' + obj[key])
    }
    return '?' + arr.join('&')
  }
}

// 卡号脱敏
export const desensitizeCardNumber = (cardNumber: string | number): string => {
  if (!cardNumber && cardNumber !== 0) {
    return ''
  }
  const cardStr = cardNumber.toString().trim()
  const firstChar = cardStr?.[0] ?? ''
  const lastChar = cardStr?.[cardStr.length - 1] ?? ''
  const middleLength = cardStr.length - 2
  const middleChars = middleLength ? '*'.repeat(middleLength) : '****'
  return `${firstChar}${middleChars}${lastChar}`
}
