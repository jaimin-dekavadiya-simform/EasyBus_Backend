import { RequestHandler } from 'express';
import { createOrganizationService } from './organization.service';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatusCode } from '@/types/utils.types';

export const createOrganizationController: RequestHandler = async (req, res) => {
  const organization = await createOrganizationService(req.body);
  ApiResponse.sendJsonResponse(
    res,
    HttpStatusCode.CREATED,
    organization,
    'Organization Created Successfully',
  );
};
