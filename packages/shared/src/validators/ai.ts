import { z } from 'zod';

export const SearchQuerySchema = z
  .object({
    query: z.string().optional(),
    q: z.string().optional(),
    topK: z.coerce.number().int().min(1).max(20).optional(),
    limit: z.coerce.number().int().min(1).max(20).optional(),
    minSimilarity: z.coerce.number().min(0).max(1).default(0.3),
  })
  .transform((data) => ({
    query: (data.query || data.q || '').trim(),
    topK: data.topK || data.limit || 5,
    minSimilarity: data.minSimilarity ?? 0.3,
  }))
  .refine((data) => data.query.length > 0, {
    message: 'Search query cannot be empty',
    path: ['query'],
  });
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1),
});

export const ChatRequestSchema = z
  .object({
    question: z.string().optional(),
    message: z.string().optional(),
    history: z.array(ChatMessageSchema).optional().default([]),
    stream: z.boolean().default(true),
  })
  .transform((data) => {
    const q = (data.question || data.message || '').trim();
    return {
      question: q,
      message: q,
      history: data.history ?? [],
      stream: data.stream ?? true,
    };
  })
  .refine((data) => data.question.length > 0, {
    message: 'Question cannot be empty',
    path: ['question'],
  });
export type ChatRequestInput = z.infer<typeof ChatRequestSchema>;

export const AgentExecuteSchema = z.object({
  task: z.literal('prepare_publish'),
  contentId: z.string().uuid(),
});
export type AgentExecuteInput = z.infer<typeof AgentExecuteSchema>;
