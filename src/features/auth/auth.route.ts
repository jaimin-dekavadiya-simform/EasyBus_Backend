import { Router } from 'express';
import { registerUser, verifyEmail } from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerUserSchema, verifyEmailSchema } from './auth.schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ValidationTarget } from '@/types/utils.types';

const router = Router();
router.post(
  '/register',
  validate(registerUserSchema, ValidationTarget.BODY),
  asyncHandler(registerUser),
);
router.get(
  '/verifyEmail',
  validate(verifyEmailSchema, ValidationTarget.QUERY),
  asyncHandler(verifyEmail),
);
export default router;
