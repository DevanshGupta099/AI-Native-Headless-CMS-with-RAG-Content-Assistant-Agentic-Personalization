import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EvaluationService } from './service';
import { prisma } from '../../config/database';

vi.mock('../../config/database', () => ({
  prisma: {
    evalResult: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    agentActionLog: {
      findMany: vi.fn(),
    },
    impression: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../services/embedding', () => ({
  createEmbeddingProvider: vi.fn().mockReturnValue({
    embed: vi.fn().mockResolvedValue(new Array(384).fill(0.01)),
  }),
}));

vi.mock('../../services/vector', () => ({
  pgVectorStore: {
    similaritySearch: vi.fn().mockResolvedValue([
      {
        id: 'chunk-1',
        contentItemId: 'item-1',
        title: 'Headless CMS',
        slug: 'headless-cms',
        type: 'BLOG_POST',
        chunkIndex: 0,
        chunkText: 'Headless CMS architecture decouples presentation layer from content storage.',
        similarity: 0.88,
      },
    ]),
  },
}));

describe('EvaluationService', () => {
  let service: EvaluationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EvaluationService();
  });

  describe('runEvaluation - retrieval_precision', () => {
    it('should compute retrieval precision and save eval result', async () => {
      (prisma.evalResult.create as any).mockImplementation(async ({ data }: any) => ({
        id: 'eval-uuid-1',
        evalType: data.evalType,
        targetId: data.targetId,
        score: data.score,
        detailsJson: data.detailsJson,
        createdAt: new Date(),
      }));

      const result = await service.runEvaluation({
        evalType: 'retrieval_precision',
        sampleSize: 2,
      });

      expect(result.evalType).toBe('retrieval_precision');
      expect(result.score).toBeGreaterThan(0);
      expect(prisma.evalResult.create).toHaveBeenCalled();
    });
  });

  describe('runEvaluation - agent_reliability', () => {
    it('should calculate completion rate and tool success step rate from action logs', async () => {
      vi.mocked(prisma.agentActionLog.findMany).mockResolvedValue([
        {
          id: 'log-1',
          task: 'Prep for publish',
          contentId: 'content-1',
          userId: 'user-1',
          status: 'completed',
          stepsJson: [
            { tool: 'generate_meta_description', status: 'success' },
            { tool: 'check_seo_score', status: 'success' },
          ],
          resultJson: { metaDescription: 'Sample', seoScore: 90 },
          createdAt: new Date(),
        },
        {
          id: 'log-2',
          task: 'Prep for publish',
          contentId: 'content-2',
          userId: 'user-1',
          status: 'completed',
          stepsJson: [
            { tool: 'suggest_audience_segment', status: 'success' },
          ],
          resultJson: { recommendedSegment: 'Enterprise' },
          createdAt: new Date(),
        },
      ]);

      (prisma.evalResult.create as any).mockImplementation(async ({ data }: any) => ({
        id: 'eval-uuid-2',
        evalType: data.evalType,
        targetId: data.targetId,
        score: data.score,
        detailsJson: data.detailsJson,
        createdAt: new Date(),
      }));

      const result = await service.runEvaluation({
        evalType: 'agent_reliability',
        sampleSize: 10,
      });

      expect(result.evalType).toBe('agent_reliability');
      expect(result.score).toBe(1.0);
      expect(prisma.evalResult.create).toHaveBeenCalled();
    });
  });

  describe('runEvaluation - personalization_correctness', () => {
    it('should evaluate rule engine correctness and variant serving rate', async () => {
      vi.mocked(prisma.impression.findMany).mockResolvedValue([
        {
          id: 'imp-1',
          contentItemId: 'item-1',
          segmentId: 'seg-1',
          variantId: 'var-1',
          sessionId: 'session-1',
          timestamp: new Date(),
        },
      ]);

      (prisma.evalResult.create as any).mockImplementation(async ({ data }: any) => ({
        id: 'eval-uuid-3',
        evalType: data.evalType,
        targetId: data.targetId,
        score: data.score,
        detailsJson: data.detailsJson,
        createdAt: new Date(),
      }));

      const result = await service.runEvaluation({
        evalType: 'personalization_correctness',
        sampleSize: 10,
      });

      expect(result.evalType).toBe('personalization_correctness');
      expect(result.score).toBeGreaterThan(0.5);
      expect(prisma.evalResult.create).toHaveBeenCalled();
    });
  });

  describe('getSummary', () => {
    it('should return the latest score for each evaluation type', async () => {
      vi.mocked(prisma.evalResult.findFirst)
        .mockResolvedValueOnce({
          id: 'r1',
          evalType: 'retrieval_precision',
          targetId: null,
          score: 0.92,
          detailsJson: {},
          createdAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 'r2',
          evalType: 'agent_reliability',
          targetId: null,
          score: 1.0,
          detailsJson: {},
          createdAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: 'r3',
          evalType: 'personalization_correctness',
          targetId: null,
          score: 0.88,
          detailsJson: {},
          createdAt: new Date(),
        });

      const summary = await service.getSummary();

      expect(summary.retrievalPrecision?.score).toBe(0.92);
      expect(summary.agentReliability?.score).toBe(1.0);
      expect(summary.personalizationCorrectness?.score).toBe(0.88);
    });
  });
});
