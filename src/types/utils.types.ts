import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRoles } from './user.types';

export type TasyncHandler = (
  func: RequestHandler,
) => (req: Request, res: Response, next: NextFunction) => void;

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,

  INTERNAL_SERVER_ERROR = 500,
}
export enum ValidationTarget {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
}
export interface UserJwtPayload {
  userId: string;
  role: UserRoles;
}
