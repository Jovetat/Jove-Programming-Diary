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
