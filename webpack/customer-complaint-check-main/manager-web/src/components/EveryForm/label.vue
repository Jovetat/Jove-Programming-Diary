<template>
  <view v-bind="otherAttrs">{{ props.value }}</view>
</template>

<script lang="ts">
import { defineComponent, computed, useAttrs } from 'vue';

export default defineComponent({
  /**
   * Props 说明:
   * @property {any} value - 要显示的值(必填)
   */
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const attrs = useAttrs();

    // attrs 为全部作用在组件上的属性
    const otherAttrs = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { modelValue, ...restAttrs } = attrs;
      return restAttrs;
    });
    return {
      props,
      otherAttrs,
    };
  },
});
</script>
