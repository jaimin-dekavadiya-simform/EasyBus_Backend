import { ApiResponse } from '@/utils/apiResponse';
import { registerUserService, verifyEmailService } from './auth.service';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '@/types/utils.types';
import { VerifyEmailInput } from './auth.schema';

export const registerUser: RequestHandler = async (req, res) => {
  const user = await registerUserService(req.body);
  res
    .status(HttpStatusCode.CREATED)
    .json(new ApiResponse(HttpStatusCode.CREATED, user, 'User created successfully'));
};

export const verifyEmail: RequestHandler = async (req, res) => {
  await verifyEmailService(req.query as VerifyEmailInput['query']);
  res
    .status(HttpStatusCode.OK)
    .json(new ApiResponse(HttpStatusCode.OK, {}, 'Email Verified Successfully'));
};
