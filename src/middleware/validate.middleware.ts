import { ZodError, ZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ValidationTarget } from '@/types/utils.types';

export const validate =
  (schema: ZodObject, validationTarget: ValidationTarget) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[validationTarget]);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues,
        });
      }
    }
  };
