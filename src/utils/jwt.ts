import jwt from 'jsonwebtoken';
import { TokenPayload } from '../@types/express.js';
import { AppError } from './custom-error.js';

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return process.env.JWT_SECRET;
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch (error) {
    throw new AppError('Token de autenticação inválido ou expirado', 401);
  }
};
