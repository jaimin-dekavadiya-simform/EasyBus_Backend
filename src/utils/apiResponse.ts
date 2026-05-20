import { HttpStatusCode, StatusMessage } from '@/types/utils.types';
import { Response } from 'express';

class ApiResponse<T> {
  public statusCode: HttpStatusCode;
  public data: T;
  public message: string;
  public success: boolean;
  public status: StatusMessage;
  constructor(
    statusCode: HttpStatusCode,
    data: T,
    message: string = 'Success',
    status?: StatusMessage,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.status = status || StatusMessage.SUCCESS;
  }
  static sendJsonResponse<U>(
    res: Response,
    statusCode: HttpStatusCode,
    data: U,
    message: string,
    status?: StatusMessage,
  ): void {
    res.status(statusCode).json(new ApiResponse<U>(statusCode, data, message, status));
  }
}

export { ApiResponse };
