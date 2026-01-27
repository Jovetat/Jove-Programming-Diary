<template>
  <view v-bind="otherAttrs">{{ label }}</view>
</template>

<script lang="ts">
import { defineComponent, computed, useAttrs } from 'vue';

export default defineComponent({
  /**
   * Props 说明:
   * @property {string|number} value - 选中的值(必填)
   * @property {string} defaultLabel - 未找到匹配项时显示的默认文本,默认空字符串
   */
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    defaultLabel: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const attrs: any = useAttrs();

    // attrs 为全部作用在组件上的属性
    const otherAttrs = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { modelValue, options, fieldNames, defaultLabel, ...restAttrs } =
        attrs;
      return restAttrs;
    });

    const label = computed(() => {
      const options = attrs.options ?? [];
      const fieldNames = attrs.fieldNames ?? { label: 'label', value: 'value' };
      const index = options?.findIndex(
        (s: any) => s[fieldNames.value] === props.value,
      );
      return index === -1
        ? props.defaultLabel
        : options[index][fieldNames.label];
    });

    return {
      otherAttrs,
      label,
    };
  },
});
</script>
