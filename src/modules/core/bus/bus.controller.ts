import { RequestHandler } from 'express';
import { createBusService } from './bus.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';

export const createBusController: RequestHandler = async (req, res) => {
  const bus = await createBusService(req.body, req.user!);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.CREATED, bus, 'Bus Created Successfully');
};
