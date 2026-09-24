import { z } from 'zod';
import { AgentTool } from '../types';
import { MetaDescriptionOutput } from '@contentpilot/shared';

export const generateMetaDescriptionTool: AgentTool<{ contentId: string }, MetaDescriptionOutput> = {
  name: 'generate_meta_description',
  description: 'Generate an SEO-optimized meta description for the content item (max 160 characters)',
  parameters: z.object({ contentId: z.string().uuid() }),

  async execute(params, context) {
    const start = Date.now();
    const content = await context.contentService.getById(params.contentId);

    const rawBody = content.currentVersion?.bodyJson?.text;
    const bodySnippet = typeof rawBody === 'string' ? rawBody.slice(0, 1000) : '';

    const prompt = `You are an enterprise SEO specialist. Generate a compelling, high-converting meta description for this CMS article.
Requirements:
- Strict limit: Under 160 characters.
- Tone: Engaging and informative.
- Output: Return ONLY the exact meta description text, with no quotes, markdown, or commentary.

Article Title: ${content.title}
Article Excerpt: ${bodySnippet}`;

    const description = await context.llmProvider.chatSync([
      { role: 'system', content: 'You are an SEO expert. Output ONLY the meta description.' },
      { role: 'user', content: prompt },
    ]);

    const cleaned = description.trim().replace(/^["']|["']$/g, '');

    return {
      success: true,
      data: {
        metaDescription: cleaned,
        charCount: cleaned.length,
      },
      durationMs: Date.now() - start,
    };
  },
};
