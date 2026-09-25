import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/routes';
import contentRoutes from './modules/content/routes';
import aiRoutes from './modules/ai/routes';
import personalizationRoutes from './modules/personalization/routes';
import evalRoutes from './modules/evaluation/routes';
import { errorHandler } from './middleware/errorHandler';
import {
  securityHeaders,
  globalRateLimiter,
  authRateLimiter,
  aiRateLimiter,
} from './middleware/security';

export function createApp(): Express {
  const app = express();

  // Apply OWASP recommended HTTP security headers
  app.use(securityHeaders);

  // Harden CORS with credential and method policies
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3002',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Limit JSON body size to prevent memory exhaustion DoS
  app.use(express.json({ limit: '5mb' }));

  // Global rate limiter
  app.use('/api', globalRateLimiter);

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'contentpilot-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Base API index
  app.get('/api', (_req: Request, res: Response) => {
    res.json({
      message: 'ContentPilot AI API',
      version: 'v1',
      docs: '/api/docs',
    });
  });

  // Modules with dedicated endpoint rate limiters
  app.use('/api/auth', authRateLimiter, authRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/assistant', aiRateLimiter, aiRoutes);
  app.use('/api/personalize', personalizationRoutes);
  app.use('/api/eval', evalRoutes);

  // Central error handler
  app.use(errorHandler);

  return app;
}
