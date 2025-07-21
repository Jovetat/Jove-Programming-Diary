<template>
  <nut-radio-group v-model="computedData" v-bind="comAttrs">
    <nut-radio
      v-for="item in props.options"
      :key="item.value"
      :label="item.value"
      v-bind="item.comProps"
    >
      {{ item.label }}
    </nut-radio>
  </nut-radio-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAttrs } from 'vue'
import type { RadioOption } from './types'

/*
  radioGroup 组件
  - v-model 绑定当前选中值
  - options: [{ label, value, comProps? }]，每项可自定义属性
  - 其余属性透传给 nut-radio-group
*/
export default defineComponent({
  name: 'RadioGroup',
  props: {
    modelValue: {
      required: true,
    },
    options: { type: Array<RadioOption>, required: true }, // [{ label, value, comProps? }]
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // v-model 双向绑定
    const computedData = computed<any>({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value)
      },
    })
    // 透传除modelValue、options外的属性给nut-radio-group
    const attrs = useAttrs()
    const comAttrs = computed(() => {
      const { modelValue, options, ...restAttrs } = attrs
      return restAttrs
    })

    return { props, computedData, comAttrs }
  },
})
</script>

<style lang="scss" scoped></style>
