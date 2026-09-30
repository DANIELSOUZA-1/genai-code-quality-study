import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { AppError } from './utils/custom-error.js';

const app = express();
app.disable('x-powered-by');

// Middlewares globais
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS', 403));
    }
  }
}));
app.use(express.json());

// Rota de Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Rotas da API
app.use('/api', routes);

// Tratamento de rotas inexistentes (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
  });
});

// Middleware global de erros
app.use(errorMiddleware);

export default app;
