import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersonalizationService } from './service';
import { prisma } from '../../config/database';

vi.mock('../../config/database', () => ({
  prisma: {
    segment: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    contentVariant: {
      upsert: vi.fn(),
    },
    contentItem: {
      findUnique: vi.fn(),
    },
    impression: {
      create: vi.fn(),
    },
  },
}));

describe('PersonalizationService', () => {
  let service: PersonalizationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PersonalizationService();
  });

  describe('createSegment', () => {
    it('should upsert a segment definition', async () => {
      vi.mocked(prisma.segment.upsert).mockResolvedValue({
        id: 'seg-uuid-1',
        name: 'New Visitors',
        ruleJson: { isNew: true },
      });

      const res = await service.createSegment({
        name: 'New Visitors',
        ruleJson: { isNew: true },
      });

      expect(res.name).toBe('New Visitors');
      expect(prisma.segment.upsert).toHaveBeenCalled();
    });
  });

  describe('deliver', () => {
    it('should serve personalized variant when visitor matches segment rule', async () => {
      vi.mocked(prisma.contentItem.findUnique).mockResolvedValue({
        id: 'content-1',
        title: 'Home Page',
        slug: 'home-page',
        type: 'LANDING_PAGE',
        status: 'PUBLISHED',
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        versions: [{ id: 'v-1', contentItemId: 'content-1', versionNo: 1, bodyJson: { hero: 'Default Hero' }, metaJson: null, createdAt: new Date() }],
        variants: [
          {
            id: 'variant-1',
            contentItemId: 'content-1',
            segmentId: 'seg-new-visitor',
            variantBody: { hero: 'Welcome First-Time Visitor!' },
            segment: {
              id: 'seg-new-visitor',
              name: 'New Visitors',
              ruleJson: { field: 'isNewVisitor', operator: 'eq', value: true },
            },
          },
        ],
      } as never);

      const resolution = await service.deliver({
        contentId: 'content-1',
        sessionId: 'sess-123',
        isNewVisitor: true,
      });

      expect(resolution.isFallback).toBe(false);
      expect(resolution.servedVariantId).toBe('variant-1');
      expect(resolution.body).toEqual({ hero: 'Welcome First-Time Visitor!' });
      expect(prisma.impression.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            contentItemId: 'content-1',
            variantId: 'variant-1',
            sessionId: 'sess-123',
          }),
        })
      );
    });

    it('should serve fallback default content when no segment rule matches', async () => {
      vi.mocked(prisma.contentItem.findUnique).mockResolvedValue({
        id: 'content-1',
        title: 'Home Page',
        slug: 'home-page',
        type: 'LANDING_PAGE',
        status: 'PUBLISHED',
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        versions: [{ id: 'v-1', contentItemId: 'content-1', versionNo: 1, bodyJson: { hero: 'Default Hero' }, metaJson: null, createdAt: new Date() }],
        variants: [
          {
            id: 'variant-1',
            contentItemId: 'content-1',
            segmentId: 'seg-new-visitor',
            variantBody: { hero: 'Welcome First-Time Visitor!' },
            segment: {
              id: 'seg-new-visitor',
              name: 'New Visitors',
              ruleJson: { field: 'isNewVisitor', operator: 'eq', value: true },
            },
          },
        ],
      } as never);

      const resolution = await service.deliver({
        contentId: 'content-1',
        sessionId: 'sess-123',
        isNewVisitor: false, // Not a new visitor!
      });

      expect(resolution.isFallback).toBe(true);
      expect(resolution.servedVariantId).toBeNull();
      expect(resolution.body).toEqual({ hero: 'Default Hero' });
      expect(prisma.impression.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            contentItemId: 'content-1',
            variantId: null,
            sessionId: 'sess-123',
          }),
        })
      );
    });
  });
});
