import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRoles } from '@/modules/core/user/user.types';
import { Router } from 'express';
import { createUserSchema } from './user.validation';
import { ValidationTarget } from '@/types/utils.types';
import { asyncHandler } from '@/utils/asyncHandler';
import { createUserController } from './user.controller';

const router = Router();

router.post(
  '/createUser',
  authenticateUser,
  authorizeUser([UserRoles.SUPER_ADMIN, UserRoles.ORG_ADMIN, UserRoles.OPERATOR]),
  validate(createUserSchema, ValidationTarget.BODY),
  asyncHandler(createUserController),
);

export default router;
