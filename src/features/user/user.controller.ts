import { ApiResponse } from '@/utils/apiResponse';
import { registerUserService } from './user.service';
import { RequestHandler } from 'express';

export const registerUser: RequestHandler = async (req, res) => {
  const user = await registerUserService(req.body);
  res.status(201).json(new ApiResponse(201, user, 'user created successfully'));
};
