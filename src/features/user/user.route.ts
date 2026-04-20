import { Router } from 'express';
import { registerUser } from './user.controller';
import { validate } from '@/middleware/validate.middleware';
import { registerUserSchema } from './user.schema';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();
router.post('/register', validate(registerUserSchema), asyncHandler(registerUser));
export default router;
