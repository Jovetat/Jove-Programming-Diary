<template>
  <component :is="com" v-model:value="data" v-bind="props.comProps" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, watch } from 'vue'
import { components, ComponentsType } from './types'

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ComponentsType>,
      required: true,
    },
    comProps: {
      type: Object,
      default: {},
    },
    modelValue: {
      type: Object as () => any,
      required: true,
    }, // 双向绑定表单数据
  },
  setup(props, { emit }) {
    const data = ref<any>(props.modelValue)
    // 双向绑定
    watch(
      data,
      (newData) => {
        updataValue(newData)
      },
      { deep: true },
    )
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== data.value) {
          data.value = newVal
        }
      },
    )
    const com = computed(() => {
      return components[props.type] || null
    })

    const updataValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }

    return { props, com, data }
  },
})
</script>

<style lang="scss" scoped></style>
