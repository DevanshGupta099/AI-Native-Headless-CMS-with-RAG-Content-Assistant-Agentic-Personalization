export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface LLMProvider {
  readonly name: string;
  chat(messages: ChatMessage[], options?: StreamOptions): AsyncGenerator<string>;
  chatSync(messages: ChatMessage[], options?: StreamOptions): Promise<string>;
}

export interface EmbeddingProvider {
  readonly name: string;
  readonly dimensions: number;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export interface SearchResultChunk {
  id: string;
  contentItemId: string;
  title: string;
  slug: string;
  type: string;
  chunkIndex: number;
  chunkText: string;
  similarity: number;
}

export interface RAGCitation {
  contentId: string;
  title: string;
  slug: string;
  chunkText: string;
  similarity: number;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  data: T;
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
  contentId?: string;
  userId: string;
  steps: AgentStep[];
  status: 'completed' | 'failed' | 'partial';
  result: unknown;
  createdAt: string;
}

export interface MetaDescriptionOutput {
  metaDescription: string;
  charCount: number;
}

export interface SeoCheck {
  name: string;
  pass: boolean;
  detail: string;
}

export interface SeoScoreOutput {
  score: number;
  checks: SeoCheck[];
  grade: 'A' | 'B' | 'C' | 'D';
}

export interface AudienceSegmentOutput {
  segmentId: string;
  segmentName: string;
  reasoning: string;
}

export interface PrepForPublishResult {
  metaDescription: MetaDescriptionOutput;
  seoScore: SeoScoreOutput;
  audienceSegment: AudienceSegmentOutput;
}
