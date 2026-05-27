import { logger } from './utils/logger';
import express from 'express';
import { globalErrorHandler } from './middleware/errorHandler.middleware';
import AuthRouter from './modules/core/auth/auth.router';
import OrganizationRouter from './modules/core/organization/organization.router';
import cors from 'cors';
import { config } from './config/env';
import UserRouter from './modules/core/user/user.router';
import SeatLayoutRouter from './modules/core/seatLayout/seat-layout.router';
import RouteRouter from './modules/core/route/route.router';
import BusRouter from './modules/core/bus/bus.router';
import TripRouter from './modules/core/trip/trip.router';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
const app = express();

app.use(
  cors({
    origin: config.app.allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          ip: req.remoteAddress,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/organization', OrganizationRouter);
app.use('/api/seat-layout', SeatLayoutRouter);
app.use('/api/route', RouteRouter);
app.use('/api/bus', BusRouter);
app.use('/api/trip', TripRouter);
app.use(globalErrorHandler);

export default app;
