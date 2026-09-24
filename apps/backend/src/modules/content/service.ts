import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { slugify } from '../../utils/slugify';
import { triggerEmbeddingPipeline } from '../../workers/embedding.worker';
import {
  CreateContentInput,
  UpdateContentInput,
  ContentFilterInput,
  ContentItemDetail,
  ContentItemSummary,
  ContentVersionSummary,
  ContentListResponse,
} from './types';

export class ContentService {
  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title) || 'content';
    let candidate = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.contentItem.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }

      candidate = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async create(input: CreateContentInput, userId: string): Promise<ContentItemDetail> {
    const slug = await this.generateUniqueSlug(input.title);

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.contentItem.create({
        data: {
          type: input.type,
          title: input.title,
          slug,
          status: 'DRAFT',
          createdBy: userId,
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      const version = await tx.contentVersion.create({
        data: {
          contentItemId: item.id,
          versionNo: 1,
          bodyJson: input.body as Prisma.InputJsonValue,
          metaJson: (input.meta ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        },
      });

      return { item, version };
    });

    return {
      id: result.item.id,
      type: result.item.type,
      title: result.item.title,
      slug: result.item.slug,
      status: result.item.status,
      createdBy: result.item.createdBy,
      createdAt: result.item.createdAt.toISOString(),
      updatedAt: result.item.updatedAt.toISOString(),
      creator: result.item.creator,
      currentVersion: {
        id: result.version.id,
        contentItemId: result.version.contentItemId,
        versionNo: result.version.versionNo,
        bodyJson: result.version.bodyJson as Record<string, unknown>,
        metaJson: (result.version.metaJson as Record<string, unknown>) ?? null,
        createdAt: result.version.createdAt.toISOString(),
      },
    };
  }

  async list(filter: ContentFilterInput): Promise<ContentListResponse> {
    const where: Prisma.ContentItemWhereInput = {};

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = { not: 'ARCHIVED' };
    }

    if (filter.search) {
      where.title = {
        contains: filter.search,
        mode: 'insensitive',
      };
    }

    const skip = (filter.page - 1) * filter.limit;
    const take = filter.limit;

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.contentItem.count({ where }),
    ]);

    const data: ContentItemSummary[] = items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      status: item.status,
      createdBy: item.createdBy,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return {
      data,
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getById(id: string): Promise<ContentItemDetail> {
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        versions: {
          orderBy: { versionNo: 'desc' },
          take: 1,
        },
      },
    });

    if (!item) {
      throw new AppError(`Content item with ID ${id} not found`, 404, 'CONTENT_NOT_FOUND');
    }

    const latestVersion = item.versions[0];

    return {
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      status: item.status,
      createdBy: item.createdBy,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      creator: item.creator,
      currentVersion: latestVersion
        ? {
            id: latestVersion.id,
            contentItemId: latestVersion.contentItemId,
            versionNo: latestVersion.versionNo,
            bodyJson: latestVersion.bodyJson as Record<string, unknown>,
            metaJson: (latestVersion.metaJson as Record<string, unknown>) ?? null,
            createdAt: latestVersion.createdAt.toISOString(),
          }
        : undefined,
    };
  }

  async update(id: string, input: UpdateContentInput): Promise<ContentItemDetail> {
    const existing = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNo: 'desc' },
          take: 1,
        },
      },
    });

    if (!existing) {
      throw new AppError(`Content item with ID ${id} not found`, 404, 'CONTENT_NOT_FOUND');
    }

    const currentVersionNo = existing.versions[0]?.versionNo ?? 0;
    const shouldCreateNewVersion = input.body !== undefined || input.meta !== undefined;

    const result = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.contentItem.update({
        where: { id },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.type && { type: input.type }),
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      let updatedVersion = existing.versions[0];

      if (shouldCreateNewVersion) {
        const nextBody = input.body ?? existing.versions[0]?.bodyJson ?? {};
        const nextMeta = input.meta ?? existing.versions[0]?.metaJson ?? Prisma.JsonNull;

        updatedVersion = await tx.contentVersion.create({
          data: {
            contentItemId: id,
            versionNo: currentVersionNo + 1,
            bodyJson: nextBody as Prisma.InputJsonValue,
            metaJson: nextMeta as Prisma.InputJsonValue,
          },
        });
      }

      return { item: updatedItem, version: updatedVersion };
    });

    return {
      id: result.item.id,
      type: result.item.type,
      title: result.item.title,
      slug: result.item.slug,
      status: result.item.status,
      createdBy: result.item.createdBy,
      createdAt: result.item.createdAt.toISOString(),
      updatedAt: result.item.updatedAt.toISOString(),
      creator: result.item.creator,
      currentVersion: result.version
        ? {
            id: result.version.id,
            contentItemId: result.version.contentItemId,
            versionNo: result.version.versionNo,
            bodyJson: result.version.bodyJson as Record<string, unknown>,
            metaJson: (result.version.metaJson as Record<string, unknown>) ?? null,
            createdAt: result.version.createdAt.toISOString(),
          }
        : undefined,
    };
  }

  async publish(id: string): Promise<ContentItemDetail> {
    const existing = await this.getById(id);

    const updated = await prisma.contentItem.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        versions: {
          orderBy: { versionNo: 'desc' },
          take: 1,
        },
      },
    });

    // Trigger auto-embedding pipeline in the background
    await triggerEmbeddingPipeline(id).catch((err) => {
      console.error(`Failed to trigger embedding pipeline for ${id}:`, err);
    });

    return {
      id: updated.id,
      type: updated.type,
      title: updated.title,
      slug: updated.slug,
      status: updated.status,
      createdBy: updated.createdBy,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      creator: updated.creator,
      currentVersion: existing.currentVersion,
    };
  }

  async getVersions(id: string): Promise<ContentVersionSummary[]> {
    const versions = await prisma.contentVersion.findMany({
      where: { contentItemId: id },
      orderBy: { versionNo: 'desc' },
    });

    return versions.map((v) => ({
      id: v.id,
      contentItemId: v.contentItemId,
      versionNo: v.versionNo,
      bodyJson: v.bodyJson as Record<string, unknown>,
      metaJson: (v.metaJson as Record<string, unknown>) ?? null,
      createdAt: v.createdAt.toISOString(),
    }));
  }

  async archive(id: string): Promise<ContentItemSummary> {
    const item = await prisma.contentItem.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return {
      id: item.id,
      type: item.type,
      title: item.title,
      slug: item.slug,
      status: item.status,
      createdBy: item.createdBy,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}

export const contentService = new ContentService();
