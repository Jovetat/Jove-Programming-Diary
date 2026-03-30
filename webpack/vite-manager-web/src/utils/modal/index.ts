import { createApp, defineComponent, h } from 'vue';
import type { ModalFuncProps } from 'ant-design-vue';
import Antd from 'ant-design-vue';
import ModalWithInput from './ModalWithInput.vue';

interface InputModalOptions {
  title?: string;
  okText?: string;
  cancelText?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  maxLength?: number;
  defaultValue?: string; // 输入框默认值
  inputType?: 'input' | 'textarea'; // 输入框类型：'input' 为普通输入框，'textarea' 为文本域
  onOk?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  modalProps?: Partial<ModalFuncProps>;
}

/**
 * 显示带输入框的确认对话框
 * @param options 配置选项
 * @param options.title 标题（可选）
 * @param options.okText 确定按钮文字（可选，默认"确定"）
 * @param options.cancelText 取消按钮文字（可选，默认"取消"）
 * @param options.inputLabel 输入框标签（可选，默认"请输入"）
 * @param options.inputPlaceholder 输入框占位符（可选，默认"请输入内容"）
 * @param options.maxLength 输入框最大长度（可选，默认50）
 * @param options.defaultValue 输入框默认值（可选，默认为空字符串）
 * @param options.inputType 输入框类型（可选，默认"input"）：'input' 为普通输入框，'textarea' 为文本域
 * @param options.onOk 确定回调（可选），参数为输入的值
 * @param options.onCancel 取消回调（可选）
 * @param options.modalProps 透传给 Modal 的其他属性（可选）
 * @returns 销毁函数，调用后可手动关闭对话框
 */
export const inputModal = (options: InputModalOptions) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const destroy = () => {
    popupApp.unmount();
    document.body.removeChild(div);
  };

  const popupApp = createApp(
    defineComponent({
      render() {
        return h(ModalWithInput, {
          ...options,
          destroy,
          onOk: async (value: string) => {
            if (options.onOk) {
              await options.onOk(value);
            }
          },
          onCancel: () => {
            if (options.onCancel) {
              options.onCancel();
            }
          },
        });
      },
    }),
  );

  popupApp.use(Antd);
  popupApp.mount(div);

  return destroy;
};
