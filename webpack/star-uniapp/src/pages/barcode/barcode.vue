<template>
  <view id="barcode"></view>
</template>

<script>
export default {
  data() {
    return {
      isFlash: false,
      // 码类型
      barcode: [
        plus.barcode.QR,
        plus.barcode.EAN13,
        plus.barcode.EAN8,
        plus.barcode.UPCA,
        plus.barcode.UPCE,
        plus.barcode.CODABAR,
        plus.barcode.CODE39,
        plus.barcode.CODE93,
        plus.barcode.CODE128,
        plus.barcode.ITF
      ]
    }
  },
  onLoad() {
    var pages = getCurrentPages()
    var page = pages[pages.length - 1]
    var currentWebview = page.$getAppWebview()

    this.barcode = plus.barcode.create(
      'barcode',
      this.barcode,
      {
        top: '0',
        left: '0px',
        width: '100%',
        height: '100vh',
        position: 'static',
        frameColor: '#FFF',
        scanbarColor: '#5081DF'
      }
    )

    // 绑定事件
    this.barcode.onmarked = this.onMarked
    this.barcode.onerror = this.onError
    currentWebview.append(this.barcode)

    // 创建view
    this.createView(currentWebview)

    const { platform } = uni.getSystemInfoSync()
    // 安卓机
    if (platform == 'android') {
      this.barcode.start()
    }
  },
  onUnload() {
    this.barcode.setFlash(false)
    this.barcode.close()
    this.barcode.cancel()
  },
  methods: {
    // 创建页面元素
    createView(currentWebview) {
      let { statusBarHeight } = uni.getSystemInfoSync()

      // 返回按钮
      var backVew = new plus.nativeObj.View(
        'backVew',
        {
          top: (statusBarHeight + 15) + 'px',
          left: '12px',
          height: '40px',
          width: '100%'
        },
        [{
          tag: 'img',
          id: 'backBar',
          src: '/static/images/icon-arrow-left.png',
          position: {
            top: '0px',
            left: '0px',
            width: '20px',
            height: '20px'
          }
        }]
      )

      // 返回按钮
      backVew.addEventListener('click', (e) => {
        uni.navigateBack({})
      }, false)

      var scanBarVew = new plus.nativeObj.View(
        'scanBarVew',
        {
          top: '55%',
          left: '40%',
          height: '10%',
          width: '20%'
        },
        [{
          tag: 'font',
          id: 'font',
          text: '轻触点亮',
          textStyles: {
            size: '10px',
            color: '#ffffff'
          }
        }]
      )

      // 点亮手电筒
      scanBarVew.addEventListener('click', (e) => {
        this.isFlash = !this.isFlash
        this.barcode.setFlash(this.isFlash)
      })

      backVew.interceptTouchEvent(true)
      scanBarVew.interceptTouchEvent(true)
      currentWebview.append(backVew)
      currentWebview.append(scanBarVew)
    },
    onMarked(type, result) {
      console.log('marked =>', type, result)
      uni.$emit('barcodeComplete', result)
      this.barcode.cancel()
      uni.navigateBack()
    },
    onError(err) {
      console.log('err =>', err)
      this.barcode.start()
      uni.showToast({ title: '识别失败' })
    }
  }
}
</script>

<style lang="scss">

</style>
