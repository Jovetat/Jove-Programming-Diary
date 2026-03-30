import { message } from 'ant-design-vue';

interface ErrorInfo {
  code?: number;
  msg?: string;
}

export const handleRequestError = (errorInfo: ErrorInfo) => {
  const { msg } = errorInfo;

  const displayMessage = msg || '请求错误';

  message.error(displayMessage, 5);
};
