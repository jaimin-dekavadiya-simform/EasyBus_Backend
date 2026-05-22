import { RequestHandler } from 'express';
import { createStopService } from './route.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';

export const createStopController: RequestHandler = async (req, res) => {
  const stop = await createStopService(req.body);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.CREATED, stop, 'Stop Created Successfully');
};
