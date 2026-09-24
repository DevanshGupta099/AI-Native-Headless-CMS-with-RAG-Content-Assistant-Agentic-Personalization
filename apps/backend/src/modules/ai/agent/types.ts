import { ZodSchema } from 'zod';
import { LLMProvider, EmbeddingProvider, ToolResult, AgentStep, AgentRun } from '@contentpilot/shared';
import { ContentService } from '../../content/service';

export type { ToolResult, AgentStep, AgentRun };

export interface AgentContext {
  contentId: string;
  userId: string;
  contentService: ContentService;
  llmProvider: LLMProvider;
  embeddingProvider: EmbeddingProvider;
}

export interface AgentTool<TParams = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: ZodSchema<TParams>;
  execute(params: TParams, context: AgentContext): Promise<ToolResult<TResult>>;
}
