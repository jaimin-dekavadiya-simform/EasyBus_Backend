import { ZodError, ZodObject } from 'zod';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationTarget } from '@/types/utils.types';

export const validate =
  (schema: ZodObject, validationTarget: ValidationTarget): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[validationTarget]);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      return next(error);
    }
  };
