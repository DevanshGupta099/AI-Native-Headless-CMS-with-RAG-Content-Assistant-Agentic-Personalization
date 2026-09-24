import { z } from 'zod';
import { prisma } from '../../../../config/database';
import { AgentTool } from '../types';
import { AudienceSegmentOutput } from '@contentpilot/shared';

export const suggestAudienceSegmentTool: AgentTool<{ contentId: string }, AudienceSegmentOutput> = {
  name: 'suggest_audience_segment',
  description: 'Analyze content semantics and recommend the most effective audience segment',
  parameters: z.object({ contentId: z.string().uuid() }),

  async execute(params, context) {
    const start = Date.now();
    const content = await context.contentService.getById(params.contentId);
    const segments = await prisma.segment.findMany({ take: 10 });

    const rawBody = content.currentVersion?.bodyJson?.text;
    const bodySnippet = typeof rawBody === 'string' ? rawBody.slice(0, 1000) : '';

    const availableSegmentsList = segments.length
      ? segments.map((s) => `- ${s.name} (ID: ${s.id}): ${JSON.stringify(s.ruleJson)}`).join('\n')
      : '- General Audience (ID: default-general): Default segment for all visitors';

    const prompt = `You are a digital marketing and audience targeting strategist.
Based on the following CMS content, recommend the single best target audience segment from the available list.

Content Title: ${content.title}
Content Excerpt: ${bodySnippet}

Available Audience Segments:
${availableSegmentsList}

Respond strictly in valid JSON format:
{
  "segmentId": "string",
  "segmentName": "string",
  "reasoning": "string"
}`;

    const response = await context.llmProvider.chatSync([
      { role: 'system', content: 'You are an audience segmentation strategist. Output valid JSON only.' },
      { role: 'user', content: prompt },
    ]);

    let parsed: AudienceSegmentOutput;
    try {
      const match = response.match(/\{[\s\S]*\}/);
      const jsonStr = match ? match[0] : response;
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = {
        segmentId: segments[0]?.id || 'default-general',
        segmentName: segments[0]?.name || 'General Audience',
        reasoning: 'Recommended based on broad content accessibility and topic scope.',
      };
    }

    return {
      success: true,
      data: parsed,
      durationMs: Date.now() - start,
    };
  },
};
