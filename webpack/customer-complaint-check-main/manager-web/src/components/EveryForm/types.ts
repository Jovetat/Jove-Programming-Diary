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
} from 'ant-design-vue';
import Label from './label.vue';
import SelectLabel from './selectLabel.vue';
import { CSSProperties } from 'vue';
import { SelectProps } from 'ant-design-vue/es/vc-select';
import { RangePickerProps } from 'ant-design-vue/es/date-picker';

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
} as const;

type ComponentProps = {
  Input: InputProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  RangePicker: RangePickerProps;
  Radio: RadioProps;
  Select: SelectProps;
  InputNumber: InputNumberProps;
  InputPassword: InputProps;
  Rate: RateProps;
  Switch: SwitchProps;
  Slider: SliderProps;
  Textarea: TextAreaProps;
  SelectLabel: SelectProps;
};

export type ComponentsType = keyof typeof components;

// formOptions 的类型
export type FormOption<T = ComponentsType> = T extends keyof ComponentProps
  ? {
      label?: string; // 文本
      type: T; // 类型
      dataIndex: string; // 数据索引，插槽时为插槽的名称
      comProps?: ComponentProps[T] & {
        style?: CSSProperties; // 样式
      };
      span: number; // 栅格布局宽度
      style?: CSSProperties; // 样式
    }
  : {
      label?: string; // 文本
      type: T; // 类型
      dataIndex: string; // 数据索引，插槽时为插槽的名称
      comProps?: {
        style?: CSSProperties;
        startComponnetsProp?: T extends 'timeRange'
          ? DatePickerProps & {
              style?: CSSProperties; // 样式
            }
          : undefined;
        endComponnetsProp?: T extends 'timeRange'
          ? DatePickerProps & {
              style?: CSSProperties; // 样式
            }
          : undefined;
        [key: string]: any; // 其他任意属性
      };
      span: number; // 栅格布局宽度
      style?: CSSProperties; // 样式
      startProp?: string; // 开始时间属性(时间范围组件特有)
      endProp?: string; // 结束时间属性(时间范围组件特有)
    };
