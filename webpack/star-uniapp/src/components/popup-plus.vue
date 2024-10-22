<template>
  <view v-if="props.isShow" class="popup-mask">
    <view class="popup-content" :style="props.popupStyle" @click.stop>
      <view v-if="props.clickCloseIcon" class="close-icon" @click="closePop">
        <nut-icon name="failure" size="28px" custom-color="#76c8ac" />
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isShow: {
      type: Boolean,
      required: true,
    }, // 指示弹出
    popupStyle: {
      type: Object,
      default: {},
    }, // 内部view style
    clickCloseIcon: {
      type: Function,
    }, // 点击关闭按钮的回调
    zIndex: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    const closePop = () => {
      props.clickCloseIcon && props.clickCloseIcon()
    }
    return { props, closePop }
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

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background: #fff;
  padding: 10px 5px;
  border-radius: 20px;
  position: fixed;
}
</style>
