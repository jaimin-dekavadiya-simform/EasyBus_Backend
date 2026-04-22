import { TasyncHandler } from '@/types/utils.types';
import { RequestHandler } from 'express';

const asyncHandler: TasyncHandler = (fn: RequestHandler) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
export { asyncHandler };
