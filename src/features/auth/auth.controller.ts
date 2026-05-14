import { ApiResponse } from '@/utils/apiResponse';
import {
  getUserService,
  loginUserService,
  registerUserService,
  verifyEmailService,
} from './auth.service';
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
  const data = await loginUserService(req.body);
  res.cookie('accessToken', data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ms(config.jwt.access.expiry),
  });
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ms(config.jwt.refresh.expiry),
  });
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.OK,
    {
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      role: data.user.role,
      id: data.user.id,
      email: data.user.email,
    },
    'User Authenticated Successfully',
  );
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

export const verifyUser: RequestHandler = async (req, res): Promise<void> => {
  const user = await getUserService({ userId: req.user!.userId });
  res.status(HttpStatusCode.OK).json(
    new ApiResponse(
      HttpStatusCode.OK,
      {
        email: user.email,
        userId: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      'user authenticated',
    ),
  );
};
