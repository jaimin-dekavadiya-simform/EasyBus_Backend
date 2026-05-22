import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRoles } from '@/types/user.types';
import { Router } from 'express';
import { createStopSchema } from './route.validation';
import { ValidationTarget } from '@/types/utils.types';
import { asyncHandler } from '@/utils/asyncHandler';
import { createStopController } from './route.controller';

const router = Router();

router.post(
  '/stop',
  authenticateUser,
  authorizeUser(UserRoles.SUPER_ADMIN),
  validate(createStopSchema, ValidationTarget.BODY),
  asyncHandler(createStopController),
);

export default router;
