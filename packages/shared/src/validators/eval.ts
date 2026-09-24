import { z } from 'zod';
import { EVAL_TYPES } from '../constants';

export const RunEvalSchema = z.object({
  evalType: z.enum(EVAL_TYPES),
  targetId: z.string().uuid().optional(),
  sampleSize: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type RunEvalInput = z.infer<typeof RunEvalSchema>;
