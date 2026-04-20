import { ApiResponse } from '@/utils/apiResponse';
import { createUser } from './user.service';
import { RequestHandler } from 'express';

export const registerUser: RequestHandler = async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(new ApiResponse(201, user, 'user created successfully'));
};
