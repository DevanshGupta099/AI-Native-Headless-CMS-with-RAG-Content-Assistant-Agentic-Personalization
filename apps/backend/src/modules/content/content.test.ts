import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentService } from './service';
import { prisma } from '../../config/database';

vi.mock('../../config/database', () => ({
  prisma: {
    contentItem: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    contentVersion: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('ContentService', () => {
  let contentService: ContentService;

  beforeEach(() => {
    vi.clearAllMocks();
    contentService = new ContentService();
  });

  describe('create', () => {
    it('should create content item and initial version 1 inside a transaction', async () => {
      vi.mocked(prisma.contentItem.findUnique).mockResolvedValue(null);

      const mockItem = {
        id: 'item-uuid-1',
        type: 'BLOG_POST' as const,
        title: 'First Post',
        slug: 'first-post',
        status: 'DRAFT' as const,
        createdBy: 'user-uuid-1',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:00:00Z'),
        creator: { id: 'user-uuid-1', name: 'Author', email: 'author@contentpilot.ai' },
      };

      const mockVersion = {
        id: 'version-uuid-1',
        contentItemId: 'item-uuid-1',
        versionNo: 1,
        bodyJson: { intro: 'Hello world' },
        metaJson: null,
        createdAt: new Date('2026-09-24T12:00:00Z'),
      };

      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        const tx = {
          contentItem: { create: vi.fn().mockResolvedValue(mockItem) },
          contentVersion: { create: vi.fn().mockResolvedValue(mockVersion) },
        };
        return callback(tx as never);
      });

      const result = await contentService.create(
        {
          type: 'BLOG_POST',
          title: 'First Post',
          body: { intro: 'Hello world' },
        },
        'user-uuid-1'
      );

      expect(result.id).toBe('item-uuid-1');
      expect(result.slug).toBe('first-post');
      expect(result.status).toBe('DRAFT');
      expect(result.currentVersion?.versionNo).toBe(1);
    });
  });

  describe('list', () => {
    it('should list content items with pagination and total count', async () => {
      const mockItems = [
        {
          id: 'item-1',
          type: 'BLOG_POST' as const,
          title: 'Post 1',
          slug: 'post-1',
          status: 'PUBLISHED' as const,
          createdBy: 'user-1',
          createdAt: new Date('2026-09-24T12:00:00Z'),
          updatedAt: new Date('2026-09-24T12:00:00Z'),
        },
      ];

      vi.mocked(prisma.contentItem.findMany).mockResolvedValue(mockItems);
      vi.mocked(prisma.contentItem.count).mockResolvedValue(1);

      const result = await contentService.list({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.data[0]?.title).toBe('Post 1');
    });
  });

  describe('getById', () => {
    it('should return content item with latest version', async () => {
      vi.mocked(prisma.contentItem.findUnique).mockResolvedValue({
        id: 'item-1',
        type: 'BLOG_POST',
        title: 'Post 1',
        slug: 'post-1',
        status: 'PUBLISHED',
        createdBy: 'user-1',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:00:00Z'),
        creator: { id: 'user-1', name: 'Author', email: 'author@contentpilot.ai' },
        versions: [
          {
            id: 'version-2',
            contentItemId: 'item-1',
            versionNo: 2,
            bodyJson: { text: 'v2 body' },
            metaJson: null,
            createdAt: new Date('2026-09-24T13:00:00Z'),
          },
        ],
      } as never);

      const result = await contentService.getById('item-1');

      expect(result.id).toBe('item-1');
      expect(result.currentVersion?.versionNo).toBe(2);
    });

    it('should throw AppError 404 if content item not found', async () => {
      vi.mocked(prisma.contentItem.findUnique).mockResolvedValue(null);

      await expect(contentService.getById('non-existent')).rejects.toThrow('not found');
    });
  });

  describe('publish', () => {
    it('should transition status to PUBLISHED', async () => {
      vi.mocked(prisma.contentItem.findUnique).mockResolvedValue({
        id: 'item-1',
        type: 'BLOG_POST',
        title: 'Post 1',
        slug: 'post-1',
        status: 'DRAFT',
        createdBy: 'user-1',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:00:00Z'),
        creator: { id: 'user-1', name: 'Author', email: 'author@contentpilot.ai' },
        versions: [],
      } as never);

      vi.mocked(prisma.contentItem.update).mockResolvedValue({
        id: 'item-1',
        type: 'BLOG_POST',
        title: 'Post 1',
        slug: 'post-1',
        status: 'PUBLISHED',
        createdBy: 'user-1',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:05:00Z'),
        creator: { id: 'user-1', name: 'Author', email: 'author@contentpilot.ai' },
        versions: [],
      } as never);

      const result = await contentService.publish('item-1');
      expect(result.status).toBe('PUBLISHED');
      expect(prisma.contentItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'item-1' },
          data: { status: 'PUBLISHED' },
        })
      );
    });
  });

  describe('getVersions', () => {
    it('should return all version records descending', async () => {
      vi.mocked(prisma.contentVersion.findMany).mockResolvedValue([
        {
          id: 'v-2',
          contentItemId: 'item-1',
          versionNo: 2,
          bodyJson: { title: 'v2' },
          metaJson: null,
          createdAt: new Date('2026-09-24T13:00:00Z'),
        },
        {
          id: 'v-1',
          contentItemId: 'item-1',
          versionNo: 1,
          bodyJson: { title: 'v1' },
          metaJson: null,
          createdAt: new Date('2026-09-24T12:00:00Z'),
        },
      ]);

      const versions = await contentService.getVersions('item-1');
      expect(versions).toHaveLength(2);
      expect(versions[0]?.versionNo).toBe(2);
      expect(versions[1]?.versionNo).toBe(1);
    });
  });

  describe('archive', () => {
    it('should set status to ARCHIVED for soft delete', async () => {
      vi.mocked(prisma.contentItem.update).mockResolvedValue({
        id: 'item-1',
        type: 'BLOG_POST',
        title: 'Post 1',
        slug: 'post-1',
        status: 'ARCHIVED',
        createdBy: 'user-1',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:10:00Z'),
      });

      const result = await contentService.archive('item-1');
      expect(result.status).toBe('ARCHIVED');
    });
  });
});
