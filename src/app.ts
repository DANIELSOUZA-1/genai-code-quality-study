import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globais
app.use(cors());
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
