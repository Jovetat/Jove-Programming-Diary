# 根据 antd 封装时间范围选择的组件

```vue
<template>
  <view class="time-range">
    <a-form-item label="创建时间" name="startDate" class="time-select">
      <a-date-picker
        v-model:value="formData.startDate"
        valueFormat="YYYY-MM-DD"
        format="YYYY-MM-DD"
        placeholder="请选择起始日期"
        :disabled-date="disabledStartDate"
      >
        <template #suffixIcon>
          <CaretDownFilled />
        </template>
      </a-date-picker>
    </a-form-item>
    <test class="content-text">到</test>
    <a-form-item name="endDate" class="time-select">
      <a-date-picker
        v-model:value="formData.endDate"
        valueFormat="YYYY-MM-DD"
        format="YYYY-MM-DD"
        placeholder="请选择结束日期"
        :disabled-date="disabledEndDate"
      >
        <template #suffixIcon>
          <CaretDownFilled />
        </template>
      </a-date-picker>
    </a-form-item>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import moment, { Moment } from 'moment'
import { CaretDownFilled } from '@ant-design/icons-vue'

export default defineComponent({
  components: { CaretDownFilled },
  props: {
    change: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const formData = ref<any>({})

    watch(
      formData,
      (newData) => {
        props.change && props.change(newData)
      },
      { deep: true },
    )

    // 向外暴露重置表单
    const reset = () => {
      formData.value = {}
    }
    // 向外暴露设置表单数据
    const set = (params: any) => {
      formData.value = { ...params }
    }
    const disabledStartDate = (startValue: Moment) => {
      if (!startValue || !formData.value.endDate) {
        return false
      }
      const endMoment = moment(formData.value.endDate, 'YYYY-MM-DD')
      return startValue.valueOf() > endMoment.endOf('day').valueOf()
    }
    const disabledEndDate = (endValue: Moment) => {
      if (!endValue || !formData.value.startDate) {
        return false
      }
      const startMoment = moment(formData.value.startDate, 'YYYY-MM-DD')
      return endValue.valueOf() < startMoment.startOf('day').valueOf()
    }

    return {
      formData,
      reset,
      set,
      disabledStartDate,
      disabledEndDate,
    }
  },
})
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
```

