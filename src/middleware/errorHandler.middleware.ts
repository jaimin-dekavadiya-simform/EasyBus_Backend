import { HttpStatusCode } from '@/types/utils.types';
import { ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (err, _, res) => {
  res.status(err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message,
    err: err,
  });
};
