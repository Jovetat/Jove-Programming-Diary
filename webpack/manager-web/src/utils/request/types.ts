import { AxiosRequestConfig } from 'axios';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  showError?: boolean;
}

export interface RequestConfig {
  api: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
  config?: AxiosRequestConfig;
  showError?: boolean;
}

export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    showError?: boolean;
  }
}
