import { AgentTool } from '../types';
import { generateMetaDescriptionTool } from './generate-meta-description';
import { checkSeoScoreTool } from './check-seo-score';
import { suggestAudienceSegmentTool } from './suggest-audience-segment';

export * from './generate-meta-description';
export * from './check-seo-score';
export * from './suggest-audience-segment';

export const allAgentTools: AgentTool<never, never>[] = [
  generateMetaDescriptionTool as unknown as AgentTool<never, never>,
  checkSeoScoreTool as unknown as AgentTool<never, never>,
  suggestAudienceSegmentTool as unknown as AgentTool<never, never>,
];
