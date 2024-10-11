import Input from 'nutui-uniapp/components/input/input.vue'
import CheckboxGroup from './every-checkGroup.vue'
import DatePicker from 'nutui-uniapp/components/datePicker/datePicker.vue'
import Radio from 'nutui-uniapp/components/radio/radio.vue'
import Picker from 'nutui-uniapp/components/picker/picker.vue'
import Rate from 'nutui-uniapp/components/rate/rate.vue'
import InputNumber from 'nutui-uniapp/components/inputNumber/inputNumber.vue'
import Switch from 'nutui-uniapp/components/switch/switch.vue'
import Label from './label.vue'
import SelectLabel from './selectLabel.vue'

export const components: any = {
  Input,
  CheckboxGroup,
  DatePicker,
  Radio,
  Picker,
  Rate,
  InputNumber,
  Switch,
  Label,
  SelectLabel,
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

// CheckboxGroup comProps 中的 options 配置
export interface CheckboxOption {
  label: string // 文本
  value: string // 值
}
