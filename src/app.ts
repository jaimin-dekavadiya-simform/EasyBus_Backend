import { logger } from './utils/logger';
import express from 'express';
import { globalErrorHandler } from './middleware/errorHandler.middleware';
import AuthRouter from './modules/core/auth/auth.route';
import SeatLayoutRouter from './modules/core/seatLayout/seat-layout.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/env';
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
app.use('/api/seat-layout', SeatLayoutRouter);
app.use(globalErrorHandler);

export default app;
