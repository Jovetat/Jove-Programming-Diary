# 高扩展性表单封装

1. 封装基于`Antd`，如果使用其他组件库请在`types.ts`替换，` searchForm.vue`更换**form**即可
2. web 经常出现查询表单，因此封装一个基础模板



## form.vue

```vue
<template>
  <view class="form">
    <a-form v-bind="props.formProps" :model="formData" ref="formRef">
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
                  :type="item.type"
                  :comProps="item.comProps"
                  v-model="formData[item.dataIndex]"
                />
              </view>
            </a-form-item>
          </template>
          <template v-if="item.type === 'Slot'">
            <a-form-item :label="item.label" :name="item.dataIndex">
              <slot
                :name="item.dataIndex"
                :formData="formData"
                :item="item"
              ></slot>
            </a-form-item>
          </template>
          <template v-if="item.type === 'timeRange'">
            <timeRangeModel
              v-model:startDate="timeRangeData.startDate"
              v-model:endDate="timeRangeData.endDate"
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
import { defineComponent, PropType, computed, ref, watch } from 'vue'
import { FormOption } from './types'
import formItem from './formItem.vue'
import timeRangeModel from './timeRangeModel.vue'

export default defineComponent({
  props: {
    formProps: {
      type: Object,
      default: {},
    }, // 透传表单属性
    modelValue: {
      required: true,
    }, // 双向绑定表单数据, 通过 v-model="" 传递
    formOptions: {
      type: Array as PropType<FormOption[]>,
      required: true,
    }, // form 选项
    /* 插槽
       formOptions type 为 timeRange 时为时间范围选择
         dataIndex 随便传
         comProps 中透传 timeRangeModel 组件参数
         startProp、endProp指示时间范围选择组件的开始和结束字段(默认为startDate和endDate)
      表单验证
        submit 外部调用此函数，验证成功调用 callback
    */
  },
  components: { formItem, timeRangeModel },
  setup(props, { emit }) {
    const formData = computed<any>(() => props.modelValue)
    const formRef = ref<any>(null)
    const timeRangeData = ref<any>({
      startDate: formData.value?.startDate || '',
      endDate: formData.value?.endDate || '',
    })

    // 监听 startDate 和 endDate
    watch(
      () => [timeRangeData.value?.startDate, timeRangeData.value?.endDate],
      ([newStartDate, newEndDate]) => {
        const updatedData = {
          ...formData.value,
          startDate: newStartDate,
          endDate: newEndDate,
        }
        updateValue(updatedData)
      },
    )
    watch(
      () => [formData.value?.startDate, formData.value?.endDate],
      ([newStartDate, newEndDate]) => {
        timeRangeData.value.startDate = newStartDate
        timeRangeData.value.endDate = newEndDate
      },
    )
    const updateValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }

    // 外部调用此方法提交表单
    const submit = (callback: Function) => {
      formRef.value
        .validate()
        .then(() => {
          const data = {
            ...formData.value,
          }
          callback && callback(data)
        })
        .catch((error: any) => {
          callback && callback(null)
          console.log('error', error)
        })
    }

    return { props, formData, formRef, timeRangeData, submit }
  },
})
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
```

## searchForm.vue

```vue
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
                    :type="item.type"
                    :comProps="item.comProps"
                    v-model="formData[item?.dataIndex]"
                  />
                </view>
              </a-form-item>
            </template>
            <template v-if="item.type === 'Slot'">
              <a-form-item :label="item.label" :name="item.dataIndex">
                <slot
                  :name="item.dataIndex"
                  :formData="formData"
                  :item="item"
                ></slot>
              </a-form-item>
            </template>
            <template v-if="item.type === 'timeRange'">
              <timeRangeModel
                v-model:startDate="timeRangeData.startDate"
                v-model:endDate="timeRangeData.endDate"
                :label="item.label"
                v-bind="item.comProps"
              />
            </template>
          </a-col>
        </a-row>
      </a-form>
    </view>
    <view class="right" v-if="props.queryCallback || props.resetCallback">
      <view class="btn-view">
        <a-button v-if="props.queryCallback" type="primary" @click="query">
          搜索
        </a-button>
        <a-button v-if="props.resetCallback" @click="reset" class="cancel-btn">
          重置
        </a-button>
      </view>
      <slot name="underRight"></slot>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, watch } from 'vue'
import { FormOption } from './types'
import formItem from './formItem.vue'
import timeRangeModel from './timeRangeModel.vue'

export default defineComponent({
  props: {
    formProps: {
      type: Object,
      default: {},
    }, // 透传表单属性
    modelValue: {
      required: true,
    }, // 双向绑定表单数据, 通过 v-model="" 传递
    formOptions: {
      type: Array as PropType<FormOption[]>,
      required: false,
      default: [],
    }, // form 选项
    queryCallback: {
      type: Function,
    },
    resetCallback: {
      type: Function,
    },

    /* 插槽
      underRight 为按钮下方插槽
      formOptions type 为 Slot 时为具名插槽，携带 modelValue 和 item
      formOptions type 为 timeRange 时为时间范围选择
        dataIndex 随便传
        comProps 中透传 timeRangeModel 组件参数
        startProp、endProp指示时间范围选择组件的开始和结束字段(默认为startDate和endDate)
    */
  },
  components: { formItem, timeRangeModel },
  setup(props, { emit }) {
    const formData = computed<any>(() => props.modelValue)
    const timeRangeData = ref({
      startDate: formData.value?.startDate || '',
      endDate: formData.value?.endDate || '',
    })

    // 监听 startDate 和 endDate
    watch(
      () => [timeRangeData.value?.startDate, timeRangeData.value?.endDate],
      ([newStartDate, newEndDate]) => {
        const updatedData = {
          ...formData.value,
          startDate: newStartDate,
          endDate: newEndDate,
        }
        updateValue(updatedData)
      },
    )
    watch(
      () => [formData.value?.startDate, formData.value?.endDate],
      ([newStartDate, newEndDate]) => {
        timeRangeData.value.startDate = newStartDate
        timeRangeData.value.endDate = newEndDate
      },
    )
    const updateValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }

    const query = () => {
      props.queryCallback && props.queryCallback(formData.value)
    }
    const reset = () => {
      updateValue()
      props.resetCallback && props.resetCallback(query)
    }

    return {
      props,
      formData,
      timeRangeData,
      query,
      reset,
    }
  },
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  background-color: white;
  padding: 15px 15px 0 15px;
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
```

## selectLabel.vue

```vue
<template>
  <view v-bind="otherAttrs">{{ label }}</view>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAttrs } from 'vue'

export default defineComponent({
  props: {
    value: {
      required: true,
    },
    defaultLabel: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const attrs: any = useAttrs()

    // attrs 为全部作用在组件上的属性
    const otherAttrs = computed(() => {
      const { modelValue, options, fieldNames, defaultLabel, ...restAttrs } =
        attrs
      return restAttrs
    })

    const label = computed(() => {
      const options = attrs.options ?? []
      const fieldNames = attrs.fieldNames ?? { label: 'label', value: 'value' }
      const index = options?.findIndex(
        (s: any) => s[fieldNames.value] === props.value,
      )
      return index === -1
        ? props.defaultLabel
        : options[index][fieldNames.label]
    })

    return {
      otherAttrs,
      label,
    }
  },
})
</script>
```

## label.vue

```vue
<template>
  <view v-bind="otherAttrs">{{ props.value }}</view>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAttrs } from 'vue'

export default defineComponent({
  props: {
    value: {
      required: true,
    },
  },
  setup(props) {
    const attrs = useAttrs()

    // attrs 为全部作用在组件上的属性
    const otherAttrs = computed(() => {
      const { modelValue, ...restAttrs } = attrs
      return restAttrs
    })
    return {
      props,
      otherAttrs,
    }
  },
})
</script>
```

## timeRangeModel.vue

```vue
<template>
  <view class="time-range">
    <a-form-item
      :label="props.label"
      :name="props.startProp"
      class="time-select"
    >
      <a-date-picker
        v-model:value="computedStartDate"
        :valueFormat="props.format"
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
        :valueFormat="props.format"
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
import { defineComponent, computed } from 'vue'
import moment, { Moment } from 'moment'
import { CaretDownFilled } from '@ant-design/icons-vue'

export default defineComponent({
  components: { CaretDownFilled },
  props: {
    startDate: {
      type: String,
      required: true,
      default: '',
    },
    endDate: {
      type: String,
      required: true,
      default: '',
    },
    startProp: {
      type: String,
      default: 'startDate',
    },
    startComponnetsProp: {
      type: Object,
    },
    endProp: {
      type: String,
      default: 'endDate',
    },
    endComponnetsProp: {
      type: Object,
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
        emit('update:startDate', value)
      },
    })
    const computedEndDate = computed({
      get: () => props.endDate,
      set: (value: string) => {
        emit('update:endDate', value)
      },
    })

    const disabledStartDate = (startValue: Moment) => {
      if (!startValue || !computedEndDate.value) {
        return false
      }
      const endMoment = moment(computedEndDate.value, props.format)
      return startValue.valueOf() > endMoment.endOf('day').valueOf()
    }
    const disabledEndDate = (endValue: Moment) => {
      if (!endValue || !computedStartDate.value) {
        return false
      }
      const startMoment = moment(computedStartDate.value, props.format)
      return endValue.valueOf() < startMoment.startOf('day').valueOf()
    }

    return {
      props,
      computedStartDate,
      computedEndDate,
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

## formItem.vue

```vue
<template>
  <component :is="com" v-model:value="computedData" v-bind="props.comProps" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { components, ComponentsType } from './types'

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
      required: true,
    }, // 双向绑定表单数据
  },
  setup(props, { emit }) {
    const computedData = computed<any>({
      get: () => props.modelValue,
      set: (value: string) => {
        emit('update:modelValue', value)
      },
    })

    const com = computed(() => {
      return components[props.type] || null
    })

    return { props, com, computedData }
  },
})
</script>
```

## types.ts

```ts
import {
  Input,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Radio,
  Select,
  InputNumber,
  Rate,
  Switch,
  Slider,
  Textarea,
  InputPassword,
  type DatePickerProps,
  type InputProps,
  type CheckboxProps,
  type CheckboxGroupProps,
  type RadioProps,
  type InputNumberProps,
  type RateProps,
  type SwitchProps,
  type SliderProps,
  type TextAreaProps,
  RangePicker,
} from 'ant-design-vue'
import Label from './label.vue'
import SelectLabel from './selectLabel.vue'
import { CSSProperties } from 'vue'
import { SelectProps } from 'ant-design-vue/es/vc-select'
import { RangePickerProps } from 'ant-design-vue/es/date-picker'

export const components = {
  Input,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  RangePicker,
  Radio,
  Select,
  InputNumber,
  InputPassword,
  Rate,
  Switch,
  Slider,
  Textarea,
  Label,
  SelectLabel,
  Slot: 'Slot', // 插槽
  timeRange: 'timeRange', // 时间范围组件
} as const

type ComponentProps = {
  Input: InputProps
  Checkbox: CheckboxProps
  CheckboxGroup: CheckboxGroupProps
  DatePicker: DatePickerProps
  RangePicker: RangePickerProps
  Radio: RadioProps
  Select: SelectProps
  InputNumber: InputNumberProps
  InputPassword: InputProps
  Rate: RateProps
  Switch: SwitchProps
  Slider: SliderProps
  Textarea: TextAreaProps
  SelectLabel: SelectProps
}

export type ComponentsType = keyof typeof components

// formOptions 的类型
export type FormOption<T = ComponentsType> = T extends keyof ComponentProps
  ? {
      label?: string // 文本
      type: T // 类型
      dataIndex: string // 数据索引，插槽时为插槽的名称
      comProps?: ComponentProps[T] & {
        style?: CSSProperties // 样式
      }
      span: number // 栅格布局宽度
      style?: CSSProperties // 样式
    }
  : {
      label?: string // 文本
      type: T // 类型
      dataIndex: string // 数据索引，插槽时为插槽的名称
      comProps?: {
        style?: CSSProperties
        startComponnetsProp?: T extends 'timeRange'
          ? DatePickerProps & {
              style?: CSSProperties // 样式
            }
          : undefined
        endComponnetsProp?: T extends 'timeRange'
          ? DatePickerProps & {
              style?: CSSProperties // 样式
            }
          : undefined
        [key: string]: any // 其他任意属性
      }
      span: number // 栅格布局宽度
      style?: CSSProperties // 样式
      startProp?: string // 开始时间属性(时间范围组件特有)
      endProp?: string // 结束时间属性(时间范围组件特有)
    }
```

## 使用案例

```vue
<template>
  <searchForm
    v-model="formData"
    :formOptions="formOptions"
    :queryCallback="queryCallback"
    :resetCallback="resetCallback"
  >
    <template #otherInfo="{ formData, item }">
      {{ formData.cardCatalogName }}
    </template>
  </searchForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import searchForm from '@/components/Form/searchForm.vue'
import { FormOption } from '@/components/Form/types'
import { cardType } from './options'

export default defineComponent({
  components: { searchForm },
  setup() {
    const formData = ref()
    const formOptions: FormOption[] = [
      {
        label: '会员卡名称',
        type: 'Input',
        dataIndex: 'cardCatalogName',
        comProps: { autocomplete: 'off', allowClear: true, maxlength: 20 },
        span: 7,
      },
      {
        label: '会员卡类别',
        type: 'CheckboxGroup',
        dataIndex: 'cardTypes',
        comProps: { options: cardType },
        span: 13,
      },
      {
        type: 'Slot',
        dataIndex: 'otherInfo',
        span: 6,
      },
    ]

    const queryCallback = (res: object) => {
      console.log(res)
    }
    const resetCallback = () => {}

    return { formData, formOptions, queryCallback, resetCallback }
  },
})
</script>
```

