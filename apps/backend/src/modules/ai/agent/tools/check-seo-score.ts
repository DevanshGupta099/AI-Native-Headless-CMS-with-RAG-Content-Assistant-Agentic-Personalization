import { z } from 'zod';
import { AgentTool } from '../types';
import { SeoScoreOutput, SeoCheck } from '@contentpilot/shared';

export const checkSeoScoreTool: AgentTool<{ contentId: string }, SeoScoreOutput> = {
  name: 'check_seo_score',
  description: 'Audit content for fundamental SEO ranking factors',
  parameters: z.object({ contentId: z.string().uuid() }),

  async execute(params, context) {
    const start = Date.now();
    const content = await context.contentService.getById(params.contentId);
    const checks: SeoCheck[] = [];

    // Check 1: Title length (ideal: 30 - 70 chars)
    const titleLength = content.title.length;
    checks.push({
      name: 'Title Length',
      pass: titleLength >= 30 && titleLength <= 70,
      detail: `${titleLength} characters (recommended: 30 - 70)`,
    });

    // Check 2: Slug format (kebab-case without uppercase)
    const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug);
    checks.push({
      name: 'URL Slug Format',
      pass: slugValid,
      detail: slugValid ? 'Valid kebab-case slug' : 'Contains non-standard characters',
    });

    // Check 3: Content Body Length (at least 200 characters)
    const rawBody = content.currentVersion?.bodyJson?.text;
    const bodyLength = typeof rawBody === 'string' ? rawBody.length : 0;
    checks.push({
      name: 'Body Depth',
      pass: bodyLength >= 200,
      detail: `${bodyLength} characters (recommended minimum: 200 for indexing)`,
    });

    // Check 4: Metadata Tags Presence
    const metaTags = content.currentVersion?.metaJson;
    const hasTags = metaTags && typeof metaTags === 'object' && 'tags' in metaTags;
    checks.push({
      name: 'Taxonomy Tags',
      pass: !!hasTags,
      detail: hasTags ? 'Taxonomy tags defined' : 'No keywords or tags attached',
    });

    const passedChecks = checks.filter((c) => c.pass).length;
    const score = Math.round((passedChecks / checks.length) * 100);

    let grade: 'A' | 'B' | 'C' | 'D' = 'D';
    if (score >= 90) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 50) grade = 'C';

    return {
      success: true,
      data: {
        score,
        checks,
        grade,
      },
      durationMs: Date.now() - start,
    };
  },
};
