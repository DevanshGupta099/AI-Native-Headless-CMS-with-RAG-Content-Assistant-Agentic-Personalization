---
name: ai-provider
description: |
  Add, configure, or modify AI provider integrations (LLM or Embedding) in ContentPilot AI.
  Use when adding a new AI model provider, switching models, or debugging AI provider issues.
  Covers Groq, HuggingFace, Ollama, and the provider abstraction layer.
---

# AI Provider Integration Skill

## Provider Architecture

ContentPilot AI uses a **provider abstraction layer** so the system is model-agnostic. All AI calls go through interfaces defined in the services layer.

```
apps/backend/src/services/
├── llm/
│   ├── types.ts              # LLMProvider interface
│   ├── groq.provider.ts      # Groq Cloud (llama-3.3-70b)
│   ├── ollama-llm.provider.ts # Ollama local LLM
│   └── index.ts              # Factory: returns provider based on env
├── embedding/
│   ├── types.ts              # EmbeddingProvider interface
│   ├── huggingface.provider.ts # HuggingFace Inference API
│   ├── ollama-embedding.provider.ts # Ollama local embeddings
│   └── index.ts              # Factory: returns provider based on env
└── vector/
    ├── types.ts              # VectorStore interface
    └── pgvector.store.ts     # pgvector implementation
```

## Core Interfaces

### LLM Provider Interface

```typescript
// apps/backend/src/services/llm/types.ts
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamOptions {
  temperature?: number;    // Default: 0.7
  maxTokens?: number;      // Default: 1024
  topP?: number;           // Default: 1.0
}

export interface LLMProvider {
  /** Streaming chat — yields tokens one at a time */
  chat(messages: ChatMessage[], options?: StreamOptions): AsyncGenerator<string>;
  
  /** Non-streaming chat — returns full response */
  chatSync(messages: ChatMessage[], options?: StreamOptions): Promise<string>;
  
  /** Provider name for logging */
  readonly name: string;
}
```

### Embedding Provider Interface

```typescript
// apps/backend/src/services/embedding/types.ts
export interface EmbeddingProvider {
  /** Embed a single text string */
  embed(text: string): Promise<number[]>;
  
  /** Embed multiple texts in a batch */
  embedBatch(texts: string[]): Promise<number[][]>;
  
  /** The dimension of embedding vectors this provider produces */
  readonly dimensions: number;
  
  /** Provider name for logging */
  readonly name: string;
}
```

## Adding a New LLM Provider

### Step 1: Create the provider file

```typescript
// apps/backend/src/services/llm/<provider-name>.provider.ts
import { LLMProvider, ChatMessage, StreamOptions } from './types';

export class <ProviderName>Provider implements LLMProvider {
  readonly name = '<provider-name>';
  
  constructor(private config: { apiKey: string; model: string }) {}

  async *chat(messages: ChatMessage[], options?: StreamOptions): AsyncGenerator<string> {
    // Implement streaming API call
    // yield each token as it arrives
  }

  async chatSync(messages: ChatMessage[], options?: StreamOptions): Promise<string> {
    // Implement non-streaming API call
    // Return the full response text
  }
}
```

### Step 2: Register in the factory

```typescript
// apps/backend/src/services/llm/index.ts
import { env } from '../../config/env';

export function createLLMProvider(): LLMProvider {
  switch (env.LLM_PROVIDER) {
    case 'groq':
      return new GroqProvider({ apiKey: env.GROQ_API_KEY, model: env.LLM_MODEL });
    case 'ollama':
      return new OllamaLLMProvider({ baseUrl: env.OLLAMA_URL, model: env.LLM_MODEL });
    case '<new-provider>':
      return new <ProviderName>Provider({ ... });
    default:
      throw new Error(`Unknown LLM provider: ${env.LLM_PROVIDER}`);
  }
}
```

### Step 3: Add env vars

Add to `apps/backend/src/config/env.ts` Zod schema and `.env.example`.

### Step 4: Document

Update `docs/backend/ai-providers.md` with the new provider's:
- Required env vars
- Rate limits
- Model options
- Free tier details

## Current Provider Configurations

### Groq (Primary LLM)
- **API**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: `llama-3.3-70b-versatile`
- **Free limits**: 30 RPM, 14,400 req/day, 131,072 context window
- **Streaming**: Supported (OpenAI-compatible SSE format)
- **Auth**: Bearer token (`GROQ_API_KEY`)

### HuggingFace Inference API (Primary Embeddings)
- **API**: `https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5`
- **Dimensions**: 384
- **Free limits**: ~1,000 requests/day
- **Auth**: Bearer token (`HUGGINGFACE_API_KEY`)

### Ollama (Local Fallback for Both)
- **LLM Model**: `llama3.2:3b` (for local dev — fast, low resource)
- **Embedding Model**: `nomic-embed-text` (768 dimensions)
- **Limits**: Unlimited (runs locally)
- **No auth required**

## Rate Limiting Strategy

```typescript
// apps/backend/src/services/llm/rate-limiter.ts
// Use a token bucket or sliding window to stay under Groq's 30 RPM
// Queue requests when at capacity, process in order
// Log rate limit warnings

export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private activeRequests = 0;
  private maxConcurrent: number;
  private windowMs: number;

  constructor(maxRequestsPerMinute: number) {
    this.maxConcurrent = maxRequestsPerMinute;
    this.windowMs = 60_000;
  }

  async acquire(): Promise<void> { /* ... */ }
  release(): void { /* ... */ }
}
```

## Testing AI Providers

- Mock providers in tests — never call real APIs in CI
- Use `vitest.mock()` to replace provider factory
- Create a `MockLLMProvider` that returns deterministic responses
- Create a `MockEmbeddingProvider` that returns fixed-dimension random vectors
