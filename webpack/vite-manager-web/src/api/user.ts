import { http } from '@/utils/request';
import appConfig from '@/config';
import type { ApiResponse } from '@/types/api';

const { lawUrgeUrl } = appConfig;

export const getMenulawUrgeUrl = () => {
  return http.post<ApiResponse>(
    `${lawUrgeUrl}/backStms/user/getresources/APP025`,
  );
};
