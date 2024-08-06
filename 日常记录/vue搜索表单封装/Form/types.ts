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
