<template>
  <view class="page">
    <!-- 自定义扫码组件 -->
    <liusheng22-barcode
      ref="barcode"
      v-model="visible"
      @success="success"
      @fail="fail"
    />

    <button @tap="openBarcode">打开组件扫码</button>
    <button @tap="jumpBarcode">跳转页面扫码</button>
  </view>
</template>

<script>
import { liusheng22Barcode } from '../components/liusheng22-barcode.vue'

export default {
  components: {
    liusheng22Barcode,
  },
  data() {
    return {
      visible: false,
    }
  },
  onLoad() {
    // 监听自定义扫码页面的事件
    uni.$off('barcodeComplete')
    uni.$on('barcodeComplete', (res) => {
      console.log('扫码完成事件回调 => ', res)
    })
  },
  methods: {
    openBarcode() {
      this.$refs.barcode.open()
    },
    jumpBarcode() {
      uni.navigateTo({
        url: '/pages/barcode/barcode',
      })
    },
  },
}
</script>

<style lang="scss"></style>
