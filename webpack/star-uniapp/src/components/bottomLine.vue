<template>
  <view
    class="bottomColor"
    :style="{ width: props.width, height: props.height }"
  ></view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: String,
      default: '100%',
    }, // 宽度
    height: {
      type: String,
      default: '5px',
    },
  },
  setup(props) {
    return {
      props,
    }
  },
})
</script>

<style lang="scss" scoped></style>
