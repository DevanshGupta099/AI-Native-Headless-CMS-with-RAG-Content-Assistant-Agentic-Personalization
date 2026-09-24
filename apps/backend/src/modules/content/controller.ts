import { Request, Response } from 'express';
import { CreateContentSchema, UpdateContentSchema, ContentFilterSchema } from '@contentpilot/shared';
import { contentService } from './service';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AppError } from '../../utils/AppError';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = CreateContentSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const result = await contentService.create(input, userId);

  res.status(201).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const filter = ContentFilterSchema.parse(req.query);
  const result = await contentService.list(filter);

  res.status(200).json(result);
});

function extractId(param: string | string[] | undefined): string {
  const id = Array.isArray(param) ? param[0] : param;
  if (!id) {
    throw new AppError('Content ID parameter is required', 400, 'BAD_REQUEST');
  }
  return id;
}

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = extractId(req.params.id);
  const result = await contentService.getById(id);

  res.status(200).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = extractId(req.params.id);
  const input = UpdateContentSchema.parse(req.body);
  const result = await contentService.update(id, input);

  res.status(200).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const publish = asyncHandler(async (req: Request, res: Response) => {
  const id = extractId(req.params.id);
  const result = await contentService.publish(id);

  res.status(200).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const getVersions = asyncHandler(async (req: Request, res: Response) => {
  const id = extractId(req.params.id);
  const versions = await contentService.getVersions(id);

  res.status(200).json({
    data: versions,
    meta: {
      total: versions.length,
      timestamp: new Date().toISOString(),
    },
  });
});

export const archive = asyncHandler(async (req: Request, res: Response) => {
  const id = extractId(req.params.id);
  const result = await contentService.archive(id);

  res.status(200).json({
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});
