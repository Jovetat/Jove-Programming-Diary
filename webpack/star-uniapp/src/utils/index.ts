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
// 检验手机号
export const checkPhone = (phone: string | number): boolean => {
  // return true
  const phoneStr = typeof phone === 'number' ? phone.toString() : phone
  const cleanedPhoneNumber = phoneStr.replace(/\D/g, '')
  const reg = /^1\d{10}$/
  return reg.test(cleanedPhoneNumber)
}
// 校验身份证号
export const validateIdCard = (id: string | number): boolean => {
  const idStr = typeof id === 'number' ? id.toString() : id
  const idRegex = /^(\d{15}|\d{17}[\dXx])$/
  if (!idRegex.test(idStr)) {
    return false
  }
  if (idStr.length === 15) {
    return true
  }
  if (idStr.length === 18) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checksumChars = [
      '1',
      '0',
      'X',
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
    ]
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idStr[i]) * weights[i]
    }
    const checksum = checksumChars[sum % 11]
    if (idStr[17].toUpperCase() !== checksum) {
      return false
    }
    return true
  }

  return false
}
// 上传图片
export const uploadPhoto = (callback: Function) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      const convertToBase64 = (filePath: any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = (error) => reject(error)
          fetch(filePath)
            .then((response) => response.blob())
            .then((blob) => reader.readAsDataURL(blob))
            .catch((error) => reject(error))
        })
      }

      try {
        const base64Image = await convertToBase64(tempFilePath)
        return callback && callback(base64Image)
      } catch (error) {
        console.error('Failed to convert image to base64', error)
        return callback && callback(null)
      }
    },
    fail: () => {
      return callback && callback(null)
    },
  })
}
// 移除 base64 文件头
export const removeBase64MimeTypePrefix = (base64String: string) => {
  return base64String.replace(/^data:.*?;base64,/, '')
}
// 添加base64文件头
export const formatBase64ForDisplay = (base64String: string) => {
  // 移除任何可能的Base64前缀，以便正确解析
  const cleanBase64 = removeBase64MimeTypePrefix(base64String)
  // 尝试解码Base64字符串以判断文件类型
  try {
    const buffer = atob(cleanBase64)
    const view = new Uint8Array(buffer.length)
    for (let i = 0; i < buffer.length; i++) {
      view[i] = buffer.charCodeAt(i)
    }
    // 检查文件签名（Magic Numbers）
    if (view[0] === 0xff && view[1] === 0xd8 && view[2] === 0xff) {
      // JPEG 文件
      return `data:image/jpeg;base64,${base64String}`
    } else if (
      view[0] === 0x89 &&
      view[1] === 0x50 &&
      view[2] === 0x4e &&
      view[3] === 0x47
    ) {
      // PNG 文件
      return `data:image/png;base64,${base64String}`
    } else {
      // 未知文件类型
      uni.showToast({
        title: '照片为未知文件类型',
        icon: 'none',
      })
      return null
    }
  } catch (e) {
    // 解码失败，可能是无效的Base64字符串
    uni.showToast({
      title: '解析照片出错',
      icon: 'none',
    })
    return null
  }
}
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
