import { z } from 'zod';
import { CONTENT_TYPES, CONTENT_STATUSES } from '../constants';

export const CreateContentSchema = z.object({
  type: z.enum(CONTENT_TYPES),
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  body: z.record(z.unknown()), // Structured JSON document
  meta: z.record(z.unknown()).optional(),
});
export type CreateContentInput = z.infer<typeof CreateContentSchema>;

export const UpdateContentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.enum(CONTENT_TYPES).optional(),
  body: z.record(z.unknown()).optional(),
  meta: z.record(z.unknown()).optional(),
});
export type UpdateContentInput = z.infer<typeof UpdateContentSchema>;

export const ContentFilterSchema = z.object({
  type: z.enum(CONTENT_TYPES).optional(),
  status: z.enum(CONTENT_STATUSES).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ContentFilterInput = z.infer<typeof ContentFilterSchema>;
