import { Request, Response } from 'express';
import { CreateSegmentSchema, CreateVariantSchema, DeliverVariantSchema } from '@contentpilot/shared';
import { personalizationService } from './service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const createSegment = asyncHandler(async (req: Request, res: Response) => {
  const input = CreateSegmentSchema.parse(req.body);
  const result = await personalizationService.createSegment(input);

  res.status(201).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const listSegments = asyncHandler(async (_req: Request, res: Response) => {
  const segments = await personalizationService.listSegments();

  res.status(200).json({
    data: segments,
    meta: {
      total: segments.length,
      timestamp: new Date().toISOString(),
    },
  });
});

export const createVariant = asyncHandler(async (req: Request, res: Response) => {
  const input = CreateVariantSchema.parse(req.body);
  const result = await personalizationService.createVariant(input);

  res.status(201).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const deliver = asyncHandler(async (req: Request, res: Response) => {
  // Query parameters: contentId, sessionId, referrer, isNewVisitor
  const query = {
    contentId: req.query.contentId,
    sessionId: req.query.sessionId,
    referrer: req.query.referrer,
    isNewVisitor: req.query.isNewVisitor === 'true' || req.query.isNewVisitor === '1',
  };

  const input = DeliverVariantSchema.parse(query);
  const result = await personalizationService.deliver(input);

  res.status(200).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});
