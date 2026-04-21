import { HttpStatusCode } from '@/types/utils.types';

class ApiResponse<T> {
  public statusCode: HttpStatusCode;
  public data: T;
  public message: string;
  public success: boolean;
  constructor(statusCode: HttpStatusCode, data: T, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
