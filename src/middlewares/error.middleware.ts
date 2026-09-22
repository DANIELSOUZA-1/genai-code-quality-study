import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/custom-error.js';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  console.error('Erro interno não tratado:', error);

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};
