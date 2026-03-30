<template>
  <view class="form">
    <a-form v-bind="props.formProps" ref="formRef" :model="formData">
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
                  v-model="formData[item.dataIndex]"
                  :type="item.type"
                  :com-props="item.comProps"
                />
              </view>
            </a-form-item>
          </template>
          <template v-if="item.type === 'Slot'">
            <a-form-item :label="item.label" :name="item.dataIndex">
              <slot :name="item.dataIndex" :form-data="formData" :item="item" />
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
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
import { FormOption } from './types';
import formItem from './formItem.vue';
import timeRangeModel from './timeRangeModel.vue';

export default defineComponent({
  components: { formItem, timeRangeModel },
  /**
   * Props 说明:
   * @property {Object} formProps - 透传表单属性
   * @property {Object} modelValue - 双向绑定的表单数据(必填)，通过 v-model 绑定
   * @property {FormOption[]} formOptions - 表单项配置数组(必填)
   *
   * 说明:
   * - formOptions type 为 timeRange 时为时间范围选择
   *   - dataIndex 随便传
   *   - comProps 中透传 timeRangeModel 组件参数
   *   - startProp、endProp 指示时间范围选择组件的开始和结束字段(默认为 startDate 和 endDate)
   * - 表单验证: submit 外部调用此函数，验证成功调用 callback
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
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formData = computed<any>(() => props.modelValue);
    const formRef = ref<any>(null);
    const timeRangeData = ref<any>({
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

    // 外部调用此方法提交表单
    const submit = (): Promise<{ success: boolean; data: any }> => {
      return formRef.value
        .validate()
        .then(() => {
          const data = {
            ...formData.value,
          };
          return { success: true, data };
        })
        .catch((error: any) => {
          console.log('form validate error', error);
          return { success: false, data: null };
        });
    };

    return { props, formData, formRef, timeRangeData, submit };
  },
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  background-color: white;
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
  .item {
    display: block;
    width: 100%;
  }
}
</style>
