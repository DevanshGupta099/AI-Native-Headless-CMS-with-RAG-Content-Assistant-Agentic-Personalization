import { z } from 'zod';

export const SearchQuerySchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  topK: z.coerce.number().int().min(1).max(20).default(5),
  minSimilarity: z.coerce.number().min(0).max(1).default(0.5),
});
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1),
});

export const ChatRequestSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  history: z.array(ChatMessageSchema).optional().default([]),
  stream: z.boolean().default(true),
});
export type ChatRequestInput = z.infer<typeof ChatRequestSchema>;

export const AgentExecuteSchema = z.object({
  task: z.literal('prepare_publish'),
  contentId: z.string().uuid(),
});
export type AgentExecuteInput = z.infer<typeof AgentExecuteSchema>;
