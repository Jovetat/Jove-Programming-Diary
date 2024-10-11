<template>
  <view v-bind="otherAttrs">{{ props.value }}</view>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAttrs } from 'vue'

export default defineComponent({
  props: {
    value: {
      required: true,
    },
  },
  setup(props) {
    const attrs = useAttrs()

    // attrs 为全部作用在组件上的属性
    const otherAttrs = computed(() => {
      const { modelValue, ...restAttrs } = attrs
      return restAttrs
    })
    return {
      props,
      otherAttrs,
    }
  },
})
</script>
