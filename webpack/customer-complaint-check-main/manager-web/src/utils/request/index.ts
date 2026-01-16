import axios, { AxiosInstance } from 'axios';
import { config } from '@/config/env';
import { setupInterceptors } from './interceptors';
import type { RequestConfig } from './types';

class Request {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setupInterceptors(this.instance);
  }

  get<T = any>(options: RequestConfig): Promise<T> {
    const {
      api,
      params,
      data,
      showError = true,
      config: axiosConfig,
    } = options;

    return this.instance.get(api, {
      params,
      data,
      ...axiosConfig,
      showError,
    });
  }

  post<T = any>(options: RequestConfig): Promise<T> {
    const {
      api,
      params,
      data,
      showError = true,
      config: axiosConfig,
    } = options;

    return this.instance.post(api, data, {
      params,
      ...axiosConfig,
      showError,
    });
  }
}

export default new Request();
