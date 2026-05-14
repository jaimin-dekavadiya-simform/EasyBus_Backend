import express from 'express';
import { globalErrorHandler } from './middleware/errorHandler.middleware';
import AuthRouter from './features/auth/auth.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/env';
const app = express();

app.use(
  cors({
    origin: config.app.allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', AuthRouter);
app.use(globalErrorHandler);

export default app;
