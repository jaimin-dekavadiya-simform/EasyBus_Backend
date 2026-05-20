import express from 'express';
import { globalErrorHandler } from './middleware/errorHandler.middleware';
import AuthRouter from './modules/core/auth/auth.route';
import OrganizationRouter from './modules/core/organization/organization.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/env';
import UserRouter from './modules/core/user/user.route';
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
app.use('/api/user', UserRouter);
app.use('/api/organization', OrganizationRouter);
app.use(globalErrorHandler);

export default app;
