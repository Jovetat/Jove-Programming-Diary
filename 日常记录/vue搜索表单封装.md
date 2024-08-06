# 表单封装

1. 封装基于`Antd`，如果使用其他组件库在`types.ts`替换，` searchForm.vue`更换**form**即可
2. web 经常出现查询表单，因此封装一个基础模板

### searchForm.vue

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
            <a-form-item :label="item.label" :name="item.dataIndex">
              <view :style="{ ...item.style }" class="item">
                <template v-if="item.type !== 'Slot'">
                  <formItem
                    :type="item.type"
                    :comProps="item.comProps"
                    v-model="formData[item.dataIndex]"
                  />
                </template>
                <template v-else>
                  <slot
                    :name="item.dataIndex"
                    :formData="formData"
                    :item="item"
                  ></slot>
                </template>
              </view>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </view>
    <view class="right">
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
import { defineComponent, ref, watch, PropType } from 'vue'
import { FormOption } from './types'
import formItem from './formItem.vue'

export default defineComponent({
  props: {
    formProps: {
      type: Object,
      default: {},
    }, // 透传表单属性
    modelValue: {
      type: Object as () => any,
      required: true,
    }, // 双向绑定表单数据, 通过 v-model="" 传递
    formOptions: {
      type: Array as PropType<FormOption[]>,
      required: true,
    }, // form 选项
    queryCallback: {
      type: Function,
    },
    resetCallback: {
      type: Function,
    },
    /* 插槽
      underRight 为按钮下方插槽
      formOptions type 为 Slot 时为具名插槽，携带 formData 和 item
    */
  },
  components: { formItem },
  setup(props, { emit }) {
    const formData = ref({ ...props.modelValue })
    // 双向绑定
    watch(
      formData,
      (newData) => {
        updataValue(newData)
      },
      { deep: true },
    )
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== formData.value) {
          formData.value = newVal
        }
      },
    )

    const updataValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }
    const query = () => {
      props.queryCallback && props.queryCallback(formData.value)
    }
    const reset = () => {
      updataValue()
      props.resetCallback && props.resetCallback()
    }

    return { props, formData, query, reset }
  },
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  background-color: white;
  padding: 15px;
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

### formItem.vue

```vue
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
```

### types.ts

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
} from 'ant-design-vue'

export const components = {
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
  Slot: 'Slot', // 插槽
} as const
export type ComponentsType = keyof typeof components

// formOptions 的类型
export interface FormOption {
  label?: string // 文本
  type: ComponentsType // 类型
  dataIndex: string // 数据索引，插槽时为插槽的名称
  comProps?: object // 组件透传属性
  span: number // 栅格布局宽度
  style?: object // 样式
}
```

### 使用案例

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

