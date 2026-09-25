import { Request, Response } from 'express';
import { SearchQuerySchema, ChatRequestSchema, AgentExecuteSchema } from '@contentpilot/shared';
import { aiService } from './service';
import { agentOrchestrator } from './agent/orchestrator';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AppError } from '../../utils/AppError';

export const search = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.method === 'GET' ? req.query : { ...req.query, ...req.body };
  const input = SearchQuerySchema.parse(raw);
  const results = await aiService.search(input.query, input.topK, input.minSimilarity);

  res.status(200).json({
    data: results,
    meta: {
      total: results.length,
      timestamp: new Date().toISOString(),
    },
  });
});

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const input = ChatRequestSchema.parse(req.body);

  if (input.stream) {
    // Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    for await (const event of aiService.streamRAGChat(input.question, input.history)) {
      res.write(`event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`);
    }

    res.end();
    return;
  }

  // Non-streaming fallback
  let answer = '';
  let sources: unknown = [];

  for await (const event of aiService.streamRAGChat(input.question, input.history)) {
    if (event.event === 'sources') {
      sources = event.data;
    } else if (event.event === 'token') {
      const data = event.data as { token: string };
      answer += data.token;
    }
  }

  res.status(200).json({
    data: {
      answer,
      sources,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const executeAgent = asyncHandler(async (req: Request, res: Response) => {
  const input = AgentExecuteSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const run = await agentOrchestrator.execute(input.task, input.contentId, userId);

  res.status(200).json({
    data: run,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export const getAgentLogs = asyncHandler(async (req: Request, res: Response) => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id) {
    throw new AppError('Run ID parameter is required', 400, 'BAD_REQUEST');
  }

  const trace = await agentOrchestrator.getRunTrace(id);

  res.status(200).json({
    data: trace,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});
