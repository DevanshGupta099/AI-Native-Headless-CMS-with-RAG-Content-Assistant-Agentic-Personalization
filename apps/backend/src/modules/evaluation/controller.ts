import { Request, Response } from 'express';
import { RunEvalSchema } from '@contentpilot/shared';
import { evaluationService } from './service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const runEval = asyncHandler(async (req: Request, res: Response) => {
  const input = RunEvalSchema.parse(req.body);
  const result = await evaluationService.runEvaluation(input);

  res.status(201).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const getResults = asyncHandler(async (req: Request, res: Response) => {
  const evalType = typeof req.query.evalType === 'string' ? req.query.evalType : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

  const results = await evaluationService.getResults(evalType, limit);

  res.status(200).json({
    data: results,
    meta: {
      total: results.length,
      timestamp: new Date().toISOString(),
    },
  });
});

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await evaluationService.getSummary();

  res.status(200).json({
    data: summary,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});
