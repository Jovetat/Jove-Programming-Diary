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
