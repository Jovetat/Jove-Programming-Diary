<template>
  <component :is="com" v-model="computedData" v-bind="props.comProps" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { components } from './types'
import type { ComponentsType } from './types'

export default defineComponent({
  props: {
    type: {
      type: String as () => ComponentsType,
      required: true,
    },
    comProps: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      required: true,
    }, // 双向绑定表单数据
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const computedData = computed<any>({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value)
      },
    })

    const com = computed(() => {
      return components[props.type] || null
    })

    return { props, com, computedData }
  },
})
</script>

<style lang="scss" scoped></style>
