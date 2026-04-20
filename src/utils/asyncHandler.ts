import { TasyncHandler } from '@/types/utils.types';
import { RequestHandler } from 'express';
import ApiError from './apiError';

const asyncHandler: TasyncHandler = (fn: RequestHandler) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }
};
export { asyncHandler };
