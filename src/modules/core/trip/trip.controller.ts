import { RequestHandler } from 'express';
import { createTripService, searchTripsBetweenStopsService } from './trip.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';
import { CreateTripInput, SearchTripInput } from './trip.validation';

export const createTripController: RequestHandler = async (req, res) => {
  const trip = await createTripService(req.validated!.body as CreateTripInput, req.user!);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.CREATED, trip, 'Trip Created Successfully');
};

export const searchTripsBetweenStopsController: RequestHandler = async (req, res) => {
  const trips = await searchTripsBetweenStopsService(req.validated!.query as SearchTripInput);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, trips, 'Trips Searched Successfully');
};
