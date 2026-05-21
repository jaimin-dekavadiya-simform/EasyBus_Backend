import { ApiResponse } from '@/utils/apiResponse';
import {
  checkUserVerification,
  getUserService,
  loginUserService,
  registerUserService,
  resendEmailService,
  verifyEmailService,
} from './auth.service';
import { RequestHandler } from 'express';
import { HttpStatusCode, StatusMessage } from '@/types/utils.types';
import { VerifyEmailInput } from './auth.validation';
import { config } from '@/config/env';
import ms from 'ms';

export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  const user = await checkUserVerification(req.body);
  if (user) {
    ApiResponse.sendJsonResponse(
      res,
      HttpStatusCode.OK,
      user.email,
      'User not verified',
      StatusMessage.PENDING_VERIFICATION,
    );
    return;
  }
  const registeredUser = await registerUserService(req.body);
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.CREATED,
    registeredUser.email,
    'User created successfully',
  );
};

export const verifyEmail: RequestHandler = async (req, res): Promise<void> => {
  await verifyEmailService(req.query as VerifyEmailInput);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, {}, 'Email Verified Successfully');
};

export const loginUser: RequestHandler = async (req, res): Promise<void> => {
  const data = await loginUserService(req.body);
  if (!data.isVerified) {
    ApiResponse.sendJsonResponse(
      res,
      HttpStatusCode.OK,
      data.user.email,
      'User not verified',
      StatusMessage.PENDING_VERIFICATION,
    );
    return;
  }
  res.cookie('accessToken', data.accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: ms(config.jwt.access.expiry),
  });
  res.cookie('refreshToken', data.refreshToken, {
    httpOnly: true,
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

export const resendEmail: RequestHandler = async (req, res): Promise<void> => {
  await resendEmailService(req.body);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, {}, 'Email Sent Successfully');
};
