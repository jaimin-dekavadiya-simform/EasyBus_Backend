import { HttpStatusCode } from '@/types/utils.types';

class ApiError extends Error {
  public statusCode: HttpStatusCode;
  public override message: string;
  public success: boolean;
  public errors: Error[] | undefined;

  constructor(statusCode: HttpStatusCode, message: string, errors?: Error[]) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

export default ApiError;
