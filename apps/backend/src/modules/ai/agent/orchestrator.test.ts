import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentOrchestrator } from './orchestrator';
import { prisma } from '../../../config/database';
import { contentService } from '../../content/service';

vi.mock('../../../config/database', () => ({
  prisma: {
    agentActionLog: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    segment: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'seg-1', name: 'New Visitors', ruleJson: { isNew: true } },
      ]),
    },
  },
}));

vi.mock('../../content/service', () => ({
  contentService: {
    getById: vi.fn(),
  },
}));

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    orchestrator = new AgentOrchestrator();
  });

  describe('execute', () => {
    it('should execute 3 tools sequentially and persist trace', async () => {
      vi.mocked(contentService.getById).mockResolvedValue({
        id: 'content-uuid-1',
        title: 'Complete Guide to Headless CMS Architecture',
        slug: 'complete-guide-to-headless-cms-architecture',
        type: 'BLOG_POST',
        status: 'DRAFT',
        createdBy: 'user-1',
        createdAt: '2026-09-24T12:00:00Z',
        updatedAt: '2026-09-24T12:00:00Z',
        currentVersion: {
          id: 'v-1',
          contentItemId: 'content-uuid-1',
          versionNo: 1,
          bodyJson: { text: 'Headless CMS decouples the presentation layer from the content repository.' },
          metaJson: { tags: ['CMS', 'Architecture'] },
          createdAt: '2026-09-24T12:00:00Z',
        },
      });

      vi.mocked(prisma.agentActionLog.create).mockResolvedValue({
        id: 'log-uuid-123',
        task: 'prepare_publish',
        contentId: 'content-uuid-1',
        userId: 'user-1',
        stepsJson: [],
        resultJson: {},
        status: 'completed',
        createdAt: new Date('2026-09-24T12:00:00Z'),
      });

      const run = await orchestrator.execute('prepare_publish', 'content-uuid-1', 'user-1');

      expect(run.id).toBe('log-uuid-123');
      expect(run.task).toBe('prepare_publish');
      expect(run.status).toBe('completed');
      expect(run.steps).toHaveLength(3);
      expect(run.steps[0]?.toolName).toBe('generate_meta_description');
      expect(run.steps[1]?.toolName).toBe('check_seo_score');
      expect(run.steps[2]?.toolName).toBe('suggest_audience_segment');
      expect(prisma.agentActionLog.create).toHaveBeenCalled();
    });

    it('should throw AppError if task is unsupported', async () => {
      await expect(orchestrator.execute('unknown_task', 'id', 'user')).rejects.toThrow('Unsupported agent task');
    });
  });
});
