import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRoles } from '@/modules/core/user/user.types';
import { Router } from 'express';
import { createRouteSchema, createStopSchema } from './route.validation';
import { ValidationTarget } from '@/types/utils.types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  createRouteController,
  createStopController,
  getAllStopsController,
} from './route.controller';

const router = Router();

router.post(
  '/stop',
  authenticateUser,
  authorizeUser(UserRoles.SUPER_ADMIN),
  validate(createStopSchema, ValidationTarget.BODY),
  asyncHandler(createStopController),
);
router.get('/stop', authenticateUser, asyncHandler(getAllStopsController));
router.post(
  '/create',
  authenticateUser,
  authorizeUser([UserRoles.ORG_ADMIN, UserRoles.SUPER_ADMIN]),
  validate(createRouteSchema, ValidationTarget.BODY),
  asyncHandler(createRouteController),
);
export default router;
