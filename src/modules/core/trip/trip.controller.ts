import { RequestHandler } from 'express';
import { createTripService } from './trip.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';

export const createTripController: RequestHandler = async (req, res) => {
  const trip = await createTripService(req.body, req.user!);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.CREATED, trip, 'Trip Created Successfully');
};
