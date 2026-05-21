import { HttpStatusCode } from '@/types/utils.types';
import { ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  _req.log.error(err);
  res.status(err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message,
    err: err,
  });
};
