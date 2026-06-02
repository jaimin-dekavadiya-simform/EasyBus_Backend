import { RequestHandler } from 'express';
import { createRouteService, createStopService, getAllStopsService } from './route.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';

export const createStopController: RequestHandler = async (req, res) => {
  const stop = await createStopService(req.body);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.CREATED, stop, 'Stop Created Successfully');
};

export const createRouteController: RequestHandler = async (req, res) => {
  const route = await createRouteService(req.body, req.user!);
  ApiResponse.sendJsonResponse(res, HttpStatusCode.CREATED, route, 'Route Created Successfully');
};

export const getAllStopsController: RequestHandler = async (req, res) => {
  const stops = await getAllStopsService();
  ApiResponse.sendJsonResponse(res, HttpStatusCode.OK, stops, 'Stops retrieved successfully');
};
