import express from 'express';
import { globalErrorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());

app.get('/', (_, res) => {
  res.send('API is running 🚀');
});
app.use(globalErrorHandler);
export default app;
