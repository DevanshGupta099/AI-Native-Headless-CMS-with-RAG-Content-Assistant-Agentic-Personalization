import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { UserRole } from '@contentpilot/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized - No token provided', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AppError('Unauthorized - Invalid token format', 401, 'UNAUTHORIZED');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Unauthorized - Invalid or expired token', 401, 'UNAUTHORIZED');
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden - Insufficient permissions', 403, 'FORBIDDEN');
    }
    next();
  };
};
