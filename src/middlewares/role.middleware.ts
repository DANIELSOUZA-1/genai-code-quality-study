import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model.js';
import { AppError } from '../utils/custom-error.js';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Acesso negado. Permissão insuficiente para realizar esta operação', 403);
    }

    next();
  };
};
