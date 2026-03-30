import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';

const instance = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(instance);

export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return instance.post(url, data, config);
  },
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return instance.put(url, data, config);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },
};

export default http;
