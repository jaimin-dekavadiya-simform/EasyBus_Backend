import { RequestHandler } from 'express';
import { createSeatLayoutService } from './seat-layout.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';

export const createSeatLayoutController: RequestHandler = async (req, res) => {
  const seatLayout = await createSeatLayoutService(req.body);
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.CREATED,
    seatLayout,
    'Seat Layout created successfully',
  );
};
