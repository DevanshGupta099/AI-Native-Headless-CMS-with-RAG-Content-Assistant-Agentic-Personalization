import { Request, Response } from 'express';
import { SearchQuerySchema, ChatRequestSchema } from '@contentpilot/shared';
import { aiService } from './service';
import { asyncHandler } from '../../middleware/asyncHandler';

export const search = asyncHandler(async (req: Request, res: Response) => {
  const input = SearchQuerySchema.parse(req.body);
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
