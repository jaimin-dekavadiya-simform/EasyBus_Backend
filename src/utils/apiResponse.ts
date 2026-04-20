import { HttpStatusCode } from '@/types/utils.types';

class ApiResponse {
  public statusCode: HttpStatusCode;
  public data: object;
  public message: string;
  public success: boolean;
  constructor(statusCode: HttpStatusCode, data: object, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
