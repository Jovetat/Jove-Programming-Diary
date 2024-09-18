<template>
  <view class="page">
    <!-- 自定义扫码组件 -->
    <liusheng22-barcode
      ref="barcode"
      v-model="visible"
      @success="success"
      @fail="fail"
    />

    <nut-button @click="openBarcode">打开组件扫码</nut-button>
    <nut-button @click="jumpBarcode" style="margin-left: 20px">
      跳转页面扫码
    </nut-button>
    <view style="margin-top: 20px">
      <view>扫码结果：{{ code }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Liusheng22Barcode from '@/components/liusheng22-barcode/liusheng22-barcode.vue'

const visible = ref(false)
const code = ref<string>('')

const barcode = ref<InstanceType<typeof Liusheng22Barcode> | null>(null)

onMounted(() => {
  // 监听自定义扫码页面的事件
  uni.$off('barcodeComplete')
  uni.$on('barcodeComplete', (res: any) => {
    console.log('扫码完成事件回调 => ', res)
  })
})

const openBarcode = () => {
  barcode.value?.open()
}
const jumpBarcode = () => {
  uni.navigateTo({
    url: '/pages/barcode/barcode',
  })
}
const success = (res: string) => {
  code.value = res
  console.log('扫码成功')
}
const fail = () => {
  console.log('扫码失败')
}
</script>

<style lang="scss">
.page {
  padding: 100px 20px;
}
</style>
