<template>
  <nut-checkbox-group v-model="computedData" v-bind="comAttrs">
    <nut-checkbox
      v-for="item in props.options"
      :key="item.value"
      :label="item.value"
    >
      <view class="blackColor">{{ item.label }}</view>
      <template #icon>
        <view
          class="icon iconfont icon-checkBoxNo blackColor"
          style="font-size: 25px"
        ></view>
      </template>
      <template #checkedIcon>
        <view
          class="icon iconfont icon-checkBoxYes iconPrimaryGreen"
          style="font-size: 25px"
        ></view>
      </template>
    </nut-checkbox>
  </nut-checkbox-group>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAttrs } from 'vue'
import type { CheckboxOption } from './types'

export default defineComponent({
  props: {
    modelValue: {
      required: true,
    },
    options: { type: Array<CheckboxOption>, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const computedData = computed<any>({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value)
      },
    })
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
