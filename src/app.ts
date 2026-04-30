import express from 'express';
import { globalErrorHandler } from './middleware/errorHandler.middleware';
import AuthRouter from './features/auth/auth.route';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', AuthRouter);
app.use(globalErrorHandler);

export default app;
