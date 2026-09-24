import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

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

  // Central error handler
  app.use(errorHandler);

  return app;
}
