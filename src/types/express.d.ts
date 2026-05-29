import { AuthUser } from './utils.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      validated?: ValidatedInput;
    }
  }
}

export type ValidatedInput = {
  body?: object;
  query?: object;
  params?: object;
};
