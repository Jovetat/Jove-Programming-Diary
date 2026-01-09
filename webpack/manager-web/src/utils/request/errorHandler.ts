import { message } from 'ant-design-vue';

interface ErrorInfo {
  code?: number;
  message?: string;
}

export const handleRequestError = (errorInfo: ErrorInfo) => {
  const { message: msg } = errorInfo;

  const displayMessage = msg || '请求错误';

  message.error(displayMessage);
};
