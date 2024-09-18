<template>
  <nut-popup :visible="props.isShow" :z-index="popupIndex" :custom-style="props.popupStyle" round
    :close-on-click-overlay="false" class="popup">
    <view v-if="props.clickCloseIcon" class="close-icon" @click="closePop">
      <nut-icon name="failure" size="28px" custom-color="#76c8ac" />
    </view>
    <slot></slot>
  </nut-popup>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      required: true,
    }, // 是否展示
    popupStyle: {
      type: Object,
      default: {},
    }, // 内部view style
    clickCloseIcon: {
      type: Function,
    }, // 点击关闭按钮的回调
  },
  setup(props) {
    const closePop = () => {
      props.clickCloseIcon && props.clickCloseIcon()
    }
    const popupIndex = 999
    return { props, closePop, popupIndex }
  },
})
</script>

<style lang="scss" scoped>
.close-icon {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 50px;
  height: 45px;
  display: flex;
  align-items: flex-end;
}

.popup {
  position: fixed;
  top: calc(50vh + 20px);
}
</style>
