import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { UserRoles } from '@/types/user.types';
import { asyncHandler } from '@/utils/asyncHandler';
import { Router } from 'express';
import { createSeatLayoutController } from './seat-layout.controller';
import { validate } from '@/middleware/validate.middleware';
import { SeatLayoutSchema } from './seat-layout.validation';
import { ValidationTarget } from '@/types/utils.types';
const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeUser([UserRoles.SUPER_ADMIN, UserRoles.ORG_ADMIN]),
  validate(SeatLayoutSchema, ValidationTarget.BODY),
  asyncHandler(createSeatLayoutController),
);

export default router;
