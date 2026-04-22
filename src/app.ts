import express from 'express';
import { globalErrorHandler } from './middleware/errorHandler.middleware';
import UserRouter from './features/user/user.route';

const app = express();

app.use(express.json());
app.use('/api/users', UserRouter);
app.use(globalErrorHandler);
export default app;
