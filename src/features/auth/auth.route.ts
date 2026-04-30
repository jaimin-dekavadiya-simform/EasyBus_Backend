import { Router } from 'express';
import { loginUser, logoutUser, registerUser, verifyEmail } from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { loginUserSchema, registerUserSchema, verifyEmailSchema } from './auth.schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ValidationTarget } from '@/types/utils.types';

const router = Router();
router.post(
  '/register',
  validate(registerUserSchema, ValidationTarget.BODY),
  asyncHandler(registerUser),
);
router.post('/login', validate(loginUserSchema, ValidationTarget.BODY), asyncHandler(loginUser));
router.post('/logout', asyncHandler(logoutUser));
router.get(
  '/verifyEmail',
  validate(verifyEmailSchema, ValidationTarget.QUERY),
  asyncHandler(verifyEmail),
);

export default router;
