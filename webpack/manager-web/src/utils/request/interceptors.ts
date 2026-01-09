import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { handleRequestError } from './errorHandler';

const handleError = (code?: number, message?: string, showError = true) => {
  if (showError) {
    handleRequestError({ code, message });
  }
};

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers['access-token'] = token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    error => {
      const { response, config } = error;
      const showError = config?.showError !== false;

      if (response) {
        const { status, data } = response;
        handleError(status, data?.message, showError);

        // 预留特殊状态码处理入口
        switch (status) {
          case 401:
            // TODO: 401 未授权处理（如跳转登录）
            break;
          case 403:
            // TODO: 403 无权限处理
            break;
        }
      } else {
        handleError(undefined, error?.message, showError);
      }

      return Promise.reject(error);
    },
  );
};
