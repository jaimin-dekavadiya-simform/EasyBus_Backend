import { ApiResponse } from '@/utils/apiResponse';
import { registerUserService, verifyEmailService } from './auth.service';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '@/types/utils.types';
import { VerifyEmailInput } from './auth.schema';

export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  const user = await registerUserService(req.body);
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.CREATED,
    { first_name: user.first_name, last_name: user.last_name, email: user.email },
    'user created Successfully',
  );
};

export const verifyEmail: RequestHandler = async (req, res): Promise<void> => {
  await verifyEmailService(req.query as VerifyEmailInput);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, {}, 'Email Verified Successfully');
};
