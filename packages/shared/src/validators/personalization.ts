import { z } from 'zod';

export const CreateSegmentSchema = z.object({
  name: z.string().min(1).max(100),
  ruleJson: z.record(z.unknown()),
});
export type CreateSegmentInput = z.infer<typeof CreateSegmentSchema>;

export const CreateVariantSchema = z.object({
  contentItemId: z.string().uuid(),
  segmentId: z.string().uuid(),
  variantBody: z.record(z.unknown()),
});
export type CreateVariantInput = z.infer<typeof CreateVariantSchema>;

export const DeliverVariantSchema = z.object({
  contentId: z.string().uuid(),
  sessionId: z.string().min(1),
  referrer: z.string().optional(),
  isNewVisitor: z.boolean().optional(),
  traits: z.record(z.unknown()).optional(),
});
export type DeliverVariantInput = z.infer<typeof DeliverVariantSchema>;
