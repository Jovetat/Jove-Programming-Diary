<script setup lang="ts">
import { onShow, onHide } from '@dcloudio/uni-app'

onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'nutui-uniapp/styles/index.scss';
@import '@/common/iconfont/iconfont.css';
@import '@/utils/global.scss';
</style>
