export interface ApiResponse<T = any> {
  msg: string;
  code: number;
  businessCode: string;
  data: T;
  success: boolean;
}
