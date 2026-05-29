import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRoles } from '@/modules/core/user/user.types';
import { Router } from 'express';
import { createOrganizationSchema } from './organization.validation';
import { ValidationTarget } from '@/types/utils.types';
import { asyncHandler } from '@/utils/asyncHandler';
import { createOrganizationController } from './organization.controller';

const router = Router();

router.post(
  '/create-organization',
  authenticateUser,
  authorizeUser(UserRoles.SUPER_ADMIN),
  validate(createOrganizationSchema, ValidationTarget.BODY),
  asyncHandler(createOrganizationController),
);

export default router;
