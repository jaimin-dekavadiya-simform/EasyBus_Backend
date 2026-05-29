import { RequestHandler } from 'express';
import { createUserService } from './user.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';
import { UserRoles } from '@/modules/core/user/user.types';

export const createUserController: RequestHandler = async (req, res): Promise<void> => {
  const user = await createUserService(req.body, req.user?.role as UserRoles);
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.CREATED,
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    },
    'User Created Scuccessfully',
  );
};
