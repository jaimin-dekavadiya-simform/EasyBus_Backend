import { HttpStatusCode } from '@/types/utils.types';
import { Response } from 'express';
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
  static sendJsonResponse<U>(
    res: Response,
    statusCode: HttpStatusCode,
    data: U,
    message: string,
  ): void {
    res.status(statusCode).json(new ApiResponse<U>(statusCode, data, message));
  }
}

export { ApiResponse };
