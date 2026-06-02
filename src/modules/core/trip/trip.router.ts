import { authenticateUser, authorizeUser } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRoles } from '@/modules/core/user/user.types';
import { Router } from 'express';
import { createTripSchema, getTripDetailSchema, searchTripSchema } from './trip.validation';
import { ValidationTarget } from '@/types/utils.types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  createTripController,
  getTripDetailsWithAvailableSeatsController,
  searchTripsBetweenStopsController,
} from './trip.controller';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeUser([UserRoles.SUPER_ADMIN, UserRoles.ORG_ADMIN, UserRoles.OPERATOR]),
  validate(createTripSchema, ValidationTarget.BODY),
  asyncHandler(createTripController),
);
router.get(
  '/search',
  authenticateUser,
  validate(searchTripSchema, ValidationTarget.QUERY),
  asyncHandler(searchTripsBetweenStopsController),
);
router.get(
  '/info',
  authenticateUser,
  validate(getTripDetailSchema, ValidationTarget.QUERY),
  asyncHandler(getTripDetailsWithAvailableSeatsController),
);
export default router;
