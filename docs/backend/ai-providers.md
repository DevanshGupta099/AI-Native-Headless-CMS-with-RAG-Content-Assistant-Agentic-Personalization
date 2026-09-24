# AI Provider Abstraction Architecture

## Provider Interfaces

To remain model-agnostic and protect against provider outages or rate limits, all AI integrations conform to abstract interfaces in `apps/backend/src/services/`.

```typescript
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
```

## Free Tier Providers

### 1. Groq Cloud (Primary LLM)
- Model: `llama-3.3-70b-versatile`
- Free Tier Limits: 30 requests/min, 14,400 requests/day
- Token window: 131,072 tokens

### 2. HuggingFace Inference API (Primary Embeddings)
- Model: `BAAI/bge-small-en-v1.5`
- Dimensions: 384
- Free Tier: ~1,000 requests/day

### 3. Ollama (Local Development Fallback)
- LLM: `llama3.2:3b`
- Embeddings: `nomic-embed-text`
- Runs entirely on local machine; zero network or cost dependencies.
