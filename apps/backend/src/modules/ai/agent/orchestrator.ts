import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import { toolRegistry, ToolRegistry } from './tool-registry';
import { AgentContext, AgentStep, AgentRun } from './types';
import { contentService } from '../../content/service';
import { createLLMProvider } from '../../../services/llm';
import { createEmbeddingProvider } from '../../../services/embedding';
import { AppError } from '../../../utils/AppError';

export class AgentOrchestrator {
  constructor(private registry: ToolRegistry = toolRegistry) {}

  async execute(task: string, contentId: string, userId: string): Promise<AgentRun> {
    if (task !== 'prepare_publish') {
      throw new AppError(`Unsupported agent task: ${task}`, 400, 'UNSUPPORTED_TASK');
    }

    const context: AgentContext = {
      contentId,
      userId,
      contentService,
      llmProvider: createLLMProvider(),
      embeddingProvider: createEmbeddingProvider(),
    };

    // Sequential multi-step execution plan
    const plannedTools = [
      'generate_meta_description',
      'check_seo_score',
      'suggest_audience_segment',
    ];

    const steps: AgentStep[] = [];
    const aggregatedResults: Record<string, unknown> = {};

    for (let i = 0; i < plannedTools.length; i++) {
      const toolName = plannedTools[i];
      if (!toolName) continue;

      const tool = this.registry.get(toolName);
      const startedAt = new Date().toISOString();
      const startMs = Date.now();

      try {
        const toolResult = await tool.execute({ contentId }, context);
        steps.push({
          stepIndex: i,
          toolName,
          input: { contentId },
          output: toolResult,
          startedAt,
          completedAt: new Date().toISOString(),
        });

        if (toolName === 'generate_meta_description') {
          aggregatedResults.metaDescription = toolResult.data;
        } else if (toolName === 'check_seo_score') {
          aggregatedResults.seoScore = toolResult.data;
        } else if (toolName === 'suggest_audience_segment') {
          aggregatedResults.audienceSegment = toolResult.data;
        }
      } catch (err: unknown) {
        steps.push({
          stepIndex: i,
          toolName,
          input: { contentId },
          output: {
            success: false,
            data: null,
            error: (err as Error).message || 'Tool execution failed',
            durationMs: Date.now() - startMs,
          },
          startedAt,
          completedAt: new Date().toISOString(),
        });
      }
    }

    const allSuccessful = steps.every((s) => s.output.success);
    const someSuccessful = steps.some((s) => s.output.success);
    const status = allSuccessful ? 'completed' : someSuccessful ? 'partial' : 'failed';

    // Persist full execution trace in database
    const savedLog = await prisma.agentActionLog.create({
      data: {
        task,
        contentId,
        userId,
        stepsJson: steps as unknown as Prisma.InputJsonValue,
        resultJson: aggregatedResults as unknown as Prisma.InputJsonValue,
        status,
      },
    });

    return {
      id: savedLog.id,
      task: savedLog.task,
      contentId: savedLog.contentId ?? undefined,
      userId: savedLog.userId,
      steps,
      status: status as 'completed' | 'failed' | 'partial',
      result: aggregatedResults,
      createdAt: savedLog.createdAt.toISOString(),
    };
  }

  async getRunTrace(runId: string): Promise<AgentRun> {
    const log = await prisma.agentActionLog.findUnique({
      where: { id: runId },
    });

    if (!log) {
      throw new AppError(`Agent action log with ID ${runId} not found`, 404, 'LOG_NOT_FOUND');
    }

    return {
      id: log.id,
      task: log.task,
      contentId: log.contentId ?? undefined,
      userId: log.userId,
      steps: log.stepsJson as unknown as AgentStep[],
      status: log.status as 'completed' | 'failed' | 'partial',
      result: log.resultJson as unknown,
      createdAt: log.createdAt.toISOString(),
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
