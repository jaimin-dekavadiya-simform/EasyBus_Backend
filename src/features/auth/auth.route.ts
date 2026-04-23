import { Router } from 'express';
import { registerUser, verifyEmail } from './auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerUserSchema, verifyEmailSchema } from './auth.schema';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();
router.post('/register', validate(registerUserSchema), asyncHandler(registerUser));
router.get('/verifyEmail', validate(verifyEmailSchema), asyncHandler(verifyEmail));
export default router;
