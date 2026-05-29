import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRoles } from '@/modules/core/user/user.types';
import { Router } from 'express';
import { CreateBusSchema } from './bus.validation';
import { ValidationTarget } from '@/types/utils.types';
import { asyncHandler } from '@/utils/asyncHandler';
import { createBusController } from './bus.controller';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeUser([UserRoles.ORG_ADMIN, UserRoles.SUPER_ADMIN]),
  validate(CreateBusSchema, ValidationTarget.BODY),
  asyncHandler(createBusController),
);

export default router;
