<template>
  <view class="form">
    <view class="left">
      <a-form v-bind="props.formProps" :model="formData">
        <a-row>
          <a-col
            v-for="(item, index) in props.formOptions"
            :key="index"
            :span="item.span"
          >
            <template v-if="item.type !== 'Slot' && item.type !== 'timeRange'">
              <a-form-item :label="item.label" :name="item.dataIndex">
                <view :style="{ ...item.style }" class="item">
                  <formItem
                    v-model="formData[item?.dataIndex]"
                    :type="item.type"
                    :com-props="item.comProps"
                  />
                </view>
              </a-form-item>
            </template>
            <template v-if="item.type === 'Slot'">
              <a-form-item :label="item.label" :name="item.dataIndex">
                <slot
                  :name="item.dataIndex"
                  :form-data="formData"
                  :item="item"
                />
              </a-form-item>
            </template>
            <template v-if="item.type === 'timeRange'">
              <timeRangeModel
                v-model:start-date="timeRangeData.startDate"
                v-model:end-date="timeRangeData.endDate"
                :label="item.label"
                v-bind="item.comProps"
              />
            </template>
          </a-col>
        </a-row>
      </a-form>
    </view>
    <view v-if="props.queryCallback || props.resetCallback" class="right">
      <view class="btn-view">
        <a-button v-if="props.queryCallback" type="primary" @click="query">
          查询
        </a-button>
        <a-button v-if="props.resetCallback" class="cancel-btn" @click="reset">
          重置
        </a-button>
      </view>
      <slot name="underRight" />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, watch } from 'vue';
import { FormOption } from './types';
import formItem from './formItem.vue';
import timeRangeModel from './timeRangeModel.vue';

export default defineComponent({
  components: { formItem, timeRangeModel },
  /**
   * Props 说明:
   * @property {Object} formProps - 透传表单属性
   * @property {Object} modelValue - 双向绑定的表单数据(必填)，通过 v-model 绑定
   * @property {FormOption[]} formOptions - 表单项配置数组
   * @property {Function} queryCallback - 搜索按钮点击回调函数
   * @property {Function} resetCallback - 重置按钮点击回调函数
   *
   * 插槽说明:
   * - underRight: 按钮下方插槽
   * - formOptions type 为 Slot 时为具名插槽，携带 modelValue 和 item
   * - formOptions type 为 timeRange 时为时间范围选择
   *   - dataIndex 随便传
   *   - comProps 中透传 timeRangeModel 组件参数
   *   - startProp、endProp 指示时间范围选择组件的开始和结束字段(默认为 startDate 和 endDate)
   */
  props: {
    formProps: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: Object,
      required: true,
    },
    formOptions: {
      type: Array as PropType<FormOption[]>,
      required: false,
      default: () => [],
    },
    queryCallback: {
      type: Function,
      default: undefined,
    },
    resetCallback: {
      type: Function,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formData = computed<any>(() => props.modelValue);
    const timeRangeData = ref({
      startDate: formData.value?.startDate || '',
      endDate: formData.value?.endDate || '',
    });

    // 监听 startDate 和 endDate
    watch(
      () => [timeRangeData.value?.startDate, timeRangeData.value?.endDate],
      ([newStartDate, newEndDate]) => {
        const updatedData = {
          ...formData.value,
          startDate: newStartDate,
          endDate: newEndDate,
        };
        updateValue(updatedData);
      },
    );
    watch(
      () => [formData.value?.startDate, formData.value?.endDate],
      ([newStartDate, newEndDate]) => {
        timeRangeData.value.startDate = newStartDate;
        timeRangeData.value.endDate = newEndDate;
      },
    );
    const updateValue = (data?: any) => {
      emit('update:modelValue', data || {});
    };

    const query = () => {
      if (props.queryCallback) {
        props.queryCallback(formData.value);
      }
    };
    const reset = () => {
      updateValue();
      if (props.resetCallback) {
        props.resetCallback(query);
      }
    };

    return {
      props,
      formData,
      timeRangeData,
      query,
      reset,
    };
  },
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  .left {
    display: block;
    width: calc(100% - 160px);
  }
  .right {
    display: block;
    width: 160px;
    .btn-view {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
  .item {
    display: block;
    width: 100%;
  }
}
</style>
