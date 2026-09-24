import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import {
  CreateSegmentInput,
  CreateVariantInput,
  DeliverVariantInput,
  SegmentDefinition,
  ContentVariantData,
  DeliveryResolution,
} from './types';

export class PersonalizationService {
  async createSegment(input: CreateSegmentInput): Promise<SegmentDefinition> {
    const segment = await prisma.segment.upsert({
      where: { name: input.name },
      update: {
        ruleJson: input.ruleJson as Prisma.InputJsonValue,
      },
      create: {
        name: input.name,
        ruleJson: input.ruleJson as Prisma.InputJsonValue,
      },
    });

    return {
      id: segment.id,
      name: segment.name,
      ruleJson: segment.ruleJson as Record<string, unknown>,
    };
  }

  async listSegments(): Promise<SegmentDefinition[]> {
    const segments = await prisma.segment.findMany({
      orderBy: { name: 'asc' },
    });

    return segments.map((s) => ({
      id: s.id,
      name: s.name,
      ruleJson: s.ruleJson as Record<string, unknown>,
    }));
  }

  async createVariant(input: CreateVariantInput): Promise<ContentVariantData> {
    const variant = await prisma.contentVariant.upsert({
      where: {
        contentItemId_segmentId: {
          contentItemId: input.contentItemId,
          segmentId: input.segmentId,
        },
      },
      update: {
        variantBody: input.variantBody as Prisma.InputJsonValue,
      },
      create: {
        contentItemId: input.contentItemId,
        segmentId: input.segmentId,
        variantBody: input.variantBody as Prisma.InputJsonValue,
      },
    });

    return {
      id: variant.id,
      contentItemId: variant.contentItemId,
      segmentId: variant.segmentId,
      variantBody: variant.variantBody as Record<string, unknown>,
    };
  }

  private matchesRule(rule: Record<string, unknown>, context: DeliverVariantInput): boolean {
    if (!rule || typeof rule !== 'object') return false;

    // Direct field matches
    if ('field' in rule && 'value' in rule) {
      const field = String(rule.field);
      const expected = rule.value;
      const op = String(rule.operator || 'eq');

      let actual: unknown;
      if (field === 'isNewVisitor') actual = context.isNewVisitor;
      else if (field === 'referrer') actual = context.referrer;
      else if (context.traits && field in context.traits) actual = context.traits[field];

      if (op === 'eq') return actual === expected;
      if (op === 'neq') return actual !== expected;
      if (op === 'contains' && typeof actual === 'string' && typeof expected === 'string') {
        return actual.toLowerCase().includes(expected.toLowerCase());
      }
    }

    // Compound AND conditions
    if (rule.operator === 'AND' && Array.isArray(rule.conditions)) {
      return rule.conditions.every((c) => this.matchesRule(c as Record<string, unknown>, context));
    }

    // Compound OR conditions
    if (rule.operator === 'OR' && Array.isArray(rule.conditions)) {
      return rule.conditions.some((c) => this.matchesRule(c as Record<string, unknown>, context));
    }

    // Default boolean match if key matches context directly
    for (const [key, val] of Object.entries(rule)) {
      if (key === 'isNew' || key === 'isNewVisitor') {
        if (context.isNewVisitor !== val) return false;
      }
    }

    return true;
  }

  async deliver(context: DeliverVariantInput): Promise<DeliveryResolution> {
    const item = await prisma.contentItem.findUnique({
      where: { id: context.contentId },
      include: {
        versions: {
          orderBy: { versionNo: 'desc' },
          take: 1,
        },
        variants: {
          include: {
            segment: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError(`Content item ${context.contentId} not found`, 404, 'CONTENT_NOT_FOUND');
    }

    const defaultBody = (item.versions[0]?.bodyJson as Record<string, unknown>) || {};

    let matchedVariant = null;
    for (const variant of item.variants) {
      const rule = variant.segment.ruleJson as Record<string, unknown>;
      if (this.matchesRule(rule, context)) {
        matchedVariant = variant;
        break;
      }
    }

    // Record delivery impression telemetry
    await prisma.impression.create({
      data: {
        contentItemId: item.id,
        segmentId: matchedVariant?.segmentId ?? null,
        variantId: matchedVariant?.id ?? null,
        sessionId: context.sessionId,
      },
    });

    if (matchedVariant) {
      return {
        contentItemId: item.id,
        servedVariantId: matchedVariant.id,
        matchedSegmentId: matchedVariant.segmentId,
        body: matchedVariant.variantBody as Record<string, unknown>,
        isFallback: false,
      };
    }

    return {
      contentItemId: item.id,
      servedVariantId: null,
      matchedSegmentId: null,
      body: defaultBody,
      isFallback: true,
    };
  }
}

export const personalizationService = new PersonalizationService();
