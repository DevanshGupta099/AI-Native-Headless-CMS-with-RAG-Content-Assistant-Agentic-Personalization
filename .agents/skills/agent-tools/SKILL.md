---
name: agent-tools
description: |
  Create, test, or debug agentic tool-calling flows in ContentPilot AI. Use when building 
  new agent tools, modifying the "Prep for Publish" workflow, or working on agent execution 
  tracing and logging. Covers the agent orchestrator, tool registry, and tool implementations.
---

# Agent Tools & Orchestration Skill

## Agent Architecture

The agent system lives in `apps/backend/src/modules/ai/agent/` and follows a sequential tool-calling pattern with full trace logging.

```
apps/backend/src/modules/ai/agent/
├── orchestrator.ts      # Plans and executes tool sequences
├── tool-registry.ts     # Registers and resolves available tools
├── types.ts             # Agent interfaces
├── tools/
│   ├── generate-meta-description.ts
│   ├── check-seo-score.ts
│   ├── suggest-audience-segment.ts
│   └── index.ts         # Re-exports all tools
└── prompts/
    └── planner.ts       # System prompts for the planning step
```

## Core Interfaces

```typescript
// apps/backend/src/modules/ai/agent/types.ts

export interface AgentTool {
  name: string;
  description: string;
  parameters: ZodSchema;
  execute(params: unknown, context: AgentContext): Promise<ToolResult>;
}

export interface AgentContext {
  contentId: string;
  userId: string;
  contentService: ContentService;
  llmProvider: LLMProvider;
  embeddingProvider: EmbeddingProvider;
}

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
  durationMs: number;
}

export interface AgentStep {
  stepIndex: number;
  toolName: string;
  input: unknown;
  output: ToolResult;
  startedAt: string;
  completedAt: string;
}

export interface AgentRun {
  id: string;
  task: string;
  contentId: string;
  steps: AgentStep[];
  status: 'completed' | 'failed' | 'partial';
  result: unknown;
  createdAt: string;
}
```

## The Orchestrator

The orchestrator follows a **plan-then-execute** pattern:

```typescript
// apps/backend/src/modules/ai/agent/orchestrator.ts

export class AgentOrchestrator {
  constructor(
    private toolRegistry: ToolRegistry,
    private llmProvider: LLMProvider,
  ) {}

  async execute(task: string, context: AgentContext): Promise<AgentRun> {
    // 1. Plan — determine which tools to call and in what order
    const plan = await this.plan(task, context);
    
    // 2. Execute — run each tool sequentially, collecting results
    const steps: AgentStep[] = [];
    for (const plannedStep of plan) {
      const tool = this.toolRegistry.get(plannedStep.toolName);
      const startedAt = new Date().toISOString();
      const start = Date.now();
      
      try {
        const result = await tool.execute(plannedStep.input, context);
        steps.push({
          stepIndex: steps.length,
          toolName: plannedStep.toolName,
          input: plannedStep.input,
          output: result,
          startedAt,
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        steps.push({
          stepIndex: steps.length,
          toolName: plannedStep.toolName,
          input: plannedStep.input,
          output: { success: false, data: null, error: String(error), durationMs: Date.now() - start },
          startedAt,
          completedAt: new Date().toISOString(),
        });
        // Continue to next step — don't fail the entire run
      }
    }
    
    // 3. Log — persist the full run trace
    const run = await this.saveRun(task, context, steps);
    return run;
  }
}
```

## "Prep for Publish" Flow

The primary agent task. When an editor clicks "Prep for Publish" on a draft:

### Tool 1: `generate_meta_description`

```typescript
// apps/backend/src/modules/ai/agent/tools/generate-meta-description.ts
export const generateMetaDescriptionTool: AgentTool = {
  name: 'generate_meta_description',
  description: 'Generate an SEO-optimized meta description for the content',
  parameters: z.object({ contentId: z.string().uuid() }),
  
  async execute(params, context) {
    const start = Date.now();
    const content = await context.contentService.getLatestVersion(params.contentId);
    
    const prompt = `Generate a compelling meta description (max 160 chars) for this content:\n\nTitle: ${content.title}\n\nBody: ${content.bodyText.slice(0, 1000)}`;
    
    const description = await context.llmProvider.chatSync([
      { role: 'system', content: 'You are an SEO expert. Output ONLY the meta description, nothing else.' },
      { role: 'user', content: prompt },
    ]);
    
    return {
      success: true,
      data: { metaDescription: description.trim(), charCount: description.trim().length },
      durationMs: Date.now() - start,
    };
  },
};
```

### Tool 2: `check_seo_score`

```typescript
// Checks: title length, meta description presence, heading structure, 
// keyword density, image alt tags, internal links
export const checkSeoScoreTool: AgentTool = {
  name: 'check_seo_score',
  description: 'Analyze content for basic SEO best practices',
  parameters: z.object({ contentId: z.string().uuid() }),
  
  async execute(params, context) {
    const content = await context.contentService.getLatestVersion(params.contentId);
    const checks = [];
    
    // Title length (50-60 chars ideal)
    checks.push({
      name: 'Title Length',
      pass: content.title.length >= 30 && content.title.length <= 70,
      detail: `${content.title.length} chars (ideal: 50-60)`,
    });
    
    // Has meta description
    checks.push({
      name: 'Meta Description',
      pass: !!content.metaJson?.description,
      detail: content.metaJson?.description ? 'Present' : 'Missing',
    });
    
    // ... more checks
    
    const score = (checks.filter(c => c.pass).length / checks.length) * 100;
    
    return {
      success: true,
      data: { score: Math.round(score), checks, grade: score >= 80 ? 'A' : score >= 60 ? 'B' : 'C' },
      durationMs: Date.now() - start,
    };
  },
};
```

### Tool 3: `suggest_audience_segment`

```typescript
// Uses LLM to analyze content and suggest the best audience segment
export const suggestAudienceSegmentTool: AgentTool = {
  name: 'suggest_audience_segment',
  description: 'Suggest the most appropriate audience segment for this content',
  parameters: z.object({ contentId: z.string().uuid() }),
  
  async execute(params, context) {
    const content = await context.contentService.getLatestVersion(params.contentId);
    const segments = await prisma.segment.findMany();
    
    const prompt = `Given this content and available audience segments, suggest the best segment match.
    
Content Title: ${content.title}
Content Body: ${content.bodyText.slice(0, 500)}

Available Segments:
${segments.map(s => `- ${s.name}: ${JSON.stringify(s.ruleJson)}`).join('\n')}

Respond in JSON: {"segmentId": "...", "segmentName": "...", "reasoning": "..."}`;
    
    const response = await context.llmProvider.chatSync([
      { role: 'system', content: 'You are a content strategist. Respond with valid JSON only.' },
      { role: 'user', content: prompt },
    ]);
    
    return {
      success: true,
      data: JSON.parse(response),
      durationMs: Date.now() - start,
    };
  },
};
```

## Adding a New Agent Tool

1. Create file in `apps/backend/src/modules/ai/agent/tools/<tool-name>.ts`
2. Implement the `AgentTool` interface
3. Register in `apps/backend/src/modules/ai/agent/tools/index.ts`
4. Add to the tool registry in `tool-registry.ts`
5. Update the planner prompt if the tool should be included in "Prep for Publish"
6. Write tests
7. Document in `docs/backend/module-structure.md`

## Agent Execution Trace UI

The Author Studio shows agent runs as a timeline:
- Each step shows: tool name, status (✓/✗), duration, expandable input/output
- The final result is a structured checklist
- Editor can approve/reject each suggestion before publishing

## Human-in-the-Loop

**Critical rule**: The agent NEVER auto-publishes. It produces suggestions that the editor reviews and approves. This is by design for trust, brand safety, and interview-readiness ("we kept the human in the loop because...").
