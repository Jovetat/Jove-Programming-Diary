<template>
  <view v-bind="otherAttrs">{{ label }}</view>
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
    const attrs: any = useAttrs()

    // attrs 为全部作用在组件上的属性
    const otherAttrs = computed(() => {
      const { modelValue, options, ...restAttrs } = attrs
      return restAttrs
    })
    const label = computed(() => {
      const options = attrs.options ?? []
      const index = options?.findIndex((s: any) => s.value === props.value)
      return index === -1 ? '' : options[index].label
    })

    return {
      otherAttrs,
      label,
    }
  },
})
</script>
