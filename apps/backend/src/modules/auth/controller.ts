import { Request, Response } from 'express';
import { RegisterSchema, LoginSchema } from '@contentpilot/shared';
import { authService } from './service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AppError } from '../../utils/AppError';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = RegisterSchema.parse(req.body);
  const result = await authService.register(input);

  res.status(201).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = LoginSchema.parse(req.body);
  const result = await authService.login(input);

  res.status(200).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const profile = await authService.getProfile(req.user.id);

  res.status(200).json({
    data: profile,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});
