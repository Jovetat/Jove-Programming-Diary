<template>
  <component :is="com" v-model:value="computedData" v-bind="props.comProps" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { components, ComponentsType } from './types';

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ComponentsType>,
      required: true,
    },
    comProps: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object] as PropType<any>,
      required: true,
    }, // 双向绑定表单数据
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const computedData = computed<any>({
      get: () => props.modelValue,
      set: (value: any) => {
        emit('update:modelValue', value);
      },
    });

    const com = computed(() => {
      return components[props.type] || null;
    });

    return { props, com, computedData };
  },
});
</script>
