<template>
  <view class="time-range">
    <a-form-item
      :label="props.label"
      :name="props.startProp"
      class="time-select"
    >
      <a-date-picker
        v-model:value="computedStartDate"
        :value-format="props.format"
        :format="props.format"
        placeholder="请选择起始日期"
        v-bind="startComponnetsProp"
        :disabled-date="disabledStartDate"
      >
        <template #suffixIcon>
          <CaretDownFilled />
        </template>
      </a-date-picker>
    </a-form-item>
    <text class="content-text">到</text>
    <a-form-item :name="props.endProp" class="time-select">
      <a-date-picker
        v-model:value="computedEndDate"
        :value-format="props.format"
        :format="props.format"
        placeholder="请选择结束日期"
        :disabled-date="disabledEndDate"
        v-bind="endComponnetsProp"
      >
        <template #suffixIcon>
          <CaretDownFilled />
        </template>
      </a-date-picker>
    </a-form-item>
  </view>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import moment, { Moment } from 'moment';
import { CaretDownFilled } from '@ant-design/icons-vue';

export default defineComponent({
  components: { CaretDownFilled },
  /**
   * Props 说明:
   * @property {string} startDate - 起始日期值(必填)
   * @property {string} endDate - 结束日期值(必填)
   * @property {string} startProp - 起始日期在表单中的字段名,默认 'startDate'
   * @property {Object} startComponnetsProp - 起始日期选择器的额外属性配置
   * @property {string} endProp - 结束日期在表单中的字段名,默认 'endDate'
   * @property {Object} endComponnetsProp - 结束日期选择器的额外属性配置
   * @property {string} format - 日期格式化字符串,默认 'YYYY-MM-DD'
   * @property {string} label - 表单项标签文本,默认 '创建时间'
   */
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    startProp: {
      type: String,
      default: 'startDate',
    },
    startComponnetsProp: {
      type: Object,
      default: () => ({}),
    },
    endProp: {
      type: String,
      default: 'endDate',
    },
    endComponnetsProp: {
      type: Object,
      default: () => ({}),
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    label: {
      type: String,
      default: '创建时间',
    },
  },
  emits: ['update:startDate', 'update:endDate'],
  setup(props, { emit }) {
    const computedStartDate = computed({
      get: () => props.startDate,
      set: (value: string) => {
        emit('update:startDate', value);
      },
    });
    const computedEndDate = computed({
      get: () => props.endDate,
      set: (value: string) => {
        emit('update:endDate', value);
      },
    });

    const disabledStartDate = (startValue: Moment) => {
      if (!startValue || !computedEndDate.value) {
        return false;
      }
      const endMoment = moment(computedEndDate.value, props.format);
      return startValue.valueOf() > endMoment.endOf('day').valueOf();
    };
    const disabledEndDate = (endValue: Moment) => {
      if (!endValue || !computedStartDate.value) {
        return false;
      }
      const startMoment = moment(computedStartDate.value, props.format);
      return endValue.valueOf() < startMoment.startOf('day').valueOf();
    };

    return {
      props,
      computedStartDate,
      computedEndDate,
      disabledStartDate,
      disabledEndDate,
    };
  },
});
</script>

<style lang="scss" scoped>
.time-range {
  display: flex;
}

.content-text {
  display: block;
  padding: 0 10px;
  line-height: 30px;
}
</style>
