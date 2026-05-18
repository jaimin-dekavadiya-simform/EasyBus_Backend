import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  resendEmail,
  verifyEmail,
  verifyUser,
} from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import {
  loginUserSchema,
  registerUserSchema,
  resendEmailSchema,
  verifyEmailSchema,
} from './auth.schema';
import { asyncHandler } from '@/utils/asyncHandler';
import { ValidationTarget } from '@/types/utils.types';
import { authenticateUser } from '@/middleware/auth.middleware';

const router = Router();

router.post(
  '/register',
  validate(registerUserSchema, ValidationTarget.BODY),
  asyncHandler(registerUser),
);
router.post('/login', validate(loginUserSchema, ValidationTarget.BODY), asyncHandler(loginUser));
router.post('/logout', authenticateUser, asyncHandler(logoutUser));
router.get(
  '/verifyEmail',
  validate(verifyEmailSchema, ValidationTarget.QUERY),
  asyncHandler(verifyEmail),
);
router.get('/me', authenticateUser, asyncHandler(verifyUser));
router.post(
  '/resend-email',
  validate(resendEmailSchema, ValidationTarget.BODY),
  asyncHandler(resendEmail),
);
export default router;
