import { ApiResponse } from '@/utils/apiResponse';
import { loginUserService, registerUserService, verifyEmailService } from './auth.service';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '@/types/utils.types';
import { VerifyEmailInput } from './auth.schema';
import { config } from '@/config/env';
import ms from 'ms';

export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  const user = await registerUserService(req.body);
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.CREATED,
    { first_name: user.firstName, last_name: user.lastName, email: user.email },
    'user created Successfully',
  );
};

export const verifyEmail: RequestHandler = async (req, res): Promise<void> => {
  await verifyEmailService(req.query as VerifyEmailInput);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, {}, 'Email Verified Successfully');
};

export const loginUser: RequestHandler = async (req, res): Promise<void> => {
  const tokens = await loginUserService(req.body);
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ms(config.jwt.access.expiry),
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ms(config.jwt.refresh.expiry),
  });
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, {}, 'User Authenticated Successfully');
};

export const logoutUser: RequestHandler = async (_req, res): Promise<void> => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, {}, 'User Logged out Successfully');
};
