<template>
  <barcode id="barcode" v-if="value"></barcode>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFlash: false, // 是否打开灯光
      currentWebview: {}, // 当前webview
      backVew: null,
      scanBarVew: null,
      barcode: {},
      // 码类型
      config: [
        plus.barcode.QR,
        plus.barcode.EAN13,
        plus.barcode.EAN8,
        plus.barcode.UPCA,
        plus.barcode.UPCE,
        plus.barcode.CODABAR,
        plus.barcode.CODE39,
        plus.barcode.CODE93,
        plus.barcode.CODE128,
        plus.barcode.ITF,
      ],
    }
  },
  created() {
    var pages = getCurrentPages()
    var page = pages[pages.length - 1]
    this.currentWebview = page.$getAppWebview()
  },
  methods: {
    open() {
      this.barcode = new plus.barcode.create('barcode', this.config, {
        top: '0',
        left: '0px',
        width: '100%',
        height: '100vh',
        position: 'static',
        frameColor: '#FFF',
        scanbarColor: '#5081DF',
      })

      // 绑定事件
      this.barcode.onmarked = this.onMarked
      this.barcode.onerror = this.onError
      var pages = getCurrentPages()
      var page = pages[pages.length - 1]
      this.currentWebview = page.$getAppWebview()
      this.currentWebview.append(this.barcode)

      const res = uni.getSystemInfoSync()
      // 安卓机
      if (res.platform == 'android') {
        this.barcode.start()
      }

      uni.hideTabBar()
      this.$emit('input', true)

      this.setView()
    },
    setView() {
      if (!this.backVew) {
        let { statusBarHeight } = uni.getSystemInfoSync()
        this.backVew = new plus.nativeObj.View(
          'backVew',
          {
            top: statusBarHeight + 15 + 'px',
            left: '12px',
            height: '40px',
            width: '100%',
          },
          [
            {
              tag: 'img',
              id: 'backBar',
              src: '/static/images/icon-arrow-close.png',
              position: {
                top: '0px',
                left: '0px',
                width: '20px',
                height: '20px',
              },
            },
          ],
        )

        // 返回按钮
        this.backVew.addEventListener(
          'click',
          (e) => {
            this.close()
          },
          false,
        )

        this.backVew.interceptTouchEvent(true)
        this.currentWebview.append(this.backVew)
      } else {
        this.backVew.show()
      }

      if (!this.scanBarVew) {
        this.scanBarVew = new plus.nativeObj.View(
          'scanBarVew',
          {
            top: '55%',
            left: '40%',
            height: '10%',
            width: '20%',
          },
          [
            {
              tag: 'font',
              id: 'font',
              text: '轻触点亮',
              textStyles: {
                size: '10px',
                color: '#ffffff',
              },
            },
          ],
        )

        // 点亮手电筒
        this.scanBarVew.addEventListener('click', (e) => {
          this.isFlash = !this.isFlash
          this.barcode.setFlash(this.isFlash)
        })

        this.scanBarVew.interceptTouchEvent(true)
        this.currentWebview.append(this.scanBarVew)
      }
    },
    close() {
      this.barcode.cancel()
      this.barcode.close()
      this.backVew.hide()
      uni.showTabBar()
      this.$emit('input', false)
    },
    onMarked(type, result) {
      console.log('marked =>', type, result)
      this.$emit('success', result)
      this.close()
    },
    onError(err) {
      console.log('error =>', err)
      this.$emit('fail', err)
      this.close()
      uni.showToast({ title: '识别失败' })
    },
  },
}
</script>

<style lang="scss">
page {
  background: transparent;
  background-color: transparent;
}
</style>
