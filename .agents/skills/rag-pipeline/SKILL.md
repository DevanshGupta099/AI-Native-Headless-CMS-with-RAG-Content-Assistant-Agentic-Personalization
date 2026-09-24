---
name: rag-pipeline
description: |
  Build, debug, or extend the RAG (Retrieval Augmented Generation) pipeline in ContentPilot AI.
  Covers content chunking, embedding generation, pgvector storage, semantic search, and 
  grounded chat with citations. Use when working on the embedding service, search, or chat features.
---

# RAG Pipeline Skill

## Pipeline Overview

```
Content Published
       │
       ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Chunking   │────▶│  Embedding   │────▶│  pgvector Store  │
│  Service    │     │  Provider    │     │  (content_embeddings) │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                   │
                                                   ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Streaming  │◀────│  LLM with    │◀────│  Similarity     │
│  SSE Output │     │  Context     │     │  Search (top-k)  │
└─────────────┘     └──────────────┘     └─────────────────┘
```

## Component Details

### 1. Content Chunking

Located in: `apps/backend/src/services/chunking/`

```typescript
interface ChunkingConfig {
  maxChunkSize: number;      // ~500 tokens (approx 2000 chars)
  overlapSize: number;       // ~50 tokens (approx 200 chars)
  minChunkSize: number;      // 100 chars — don't create tiny chunks
}

interface ContentChunk {
  chunkIndex: number;
  chunkText: string;
  metadata: {
    contentItemId: string;
    title: string;
    contentType: string;
  };
}
```

**Chunking Strategy (Recursive Text Splitter):**
1. Try splitting by `\n\n` (paragraph boundaries)
2. If chunks are still too large, split by `\n` (line boundaries)
3. If still too large, split by `. ` (sentence boundaries)
4. Last resort: split by character count
5. Apply overlap between consecutive chunks
6. Filter out chunks smaller than `minChunkSize`

### 2. Embedding Generation

Located in: `apps/backend/src/services/embedding/`

- Use the `EmbeddingProvider` interface (see ai-provider skill)
- For batch efficiency, embed all chunks of a content item in one `embedBatch()` call
- Handle provider rate limits gracefully (retry with backoff)

### 3. pgvector Storage & Search

Located in: `apps/backend/src/services/vector/`

**Storing embeddings:**
```sql
-- After chunking + embedding, insert into content_embeddings
INSERT INTO content_embeddings (id, content_item_id, chunk_index, chunk_text, embedding)
VALUES ($1, $2, $3, $4, $5::vector(384));
```

**Re-indexing on re-publish:**
```sql
-- Delete old embeddings before inserting new ones
DELETE FROM content_embeddings WHERE content_item_id = $1;
-- Then insert new chunks
```

**Semantic search:**
```sql
-- Cosine similarity search — returns top-k most similar chunks
SELECT 
  ce.id,
  ce.content_item_id,
  ce.chunk_index,
  ce.chunk_text,
  ci.title,
  ci.slug,
  ci.type,
  1 - (ce.embedding <=> $1::vector(384)) AS similarity
FROM content_embeddings ce
JOIN content_items ci ON ci.id = ce.content_item_id
WHERE ci.status = 'PUBLISHED'
ORDER BY ce.embedding <=> $1::vector(384)
LIMIT $2;
```

### 4. Background Job (Embedding Pipeline)

Located in: `apps/backend/src/workers/`

Use **BullMQ** with Redis for async job processing:

```typescript
// Job queue setup
import { Queue, Worker } from 'bullmq';

const embeddingQueue = new Queue('embedding-pipeline', { connection: redis });

// When content is published:
await embeddingQueue.add('embed-content', { contentItemId: id });

// Worker processes jobs:
const worker = new Worker('embedding-pipeline', async (job) => {
  const { contentItemId } = job.data;
  
  // 1. Fetch content body
  // 2. Chunk the text
  // 3. Generate embeddings
  // 4. Delete old embeddings
  // 5. Store new embeddings in pgvector
}, { connection: redis });
```

### 5. RAG Chat Flow

Located in: `apps/backend/src/modules/ai/`

```typescript
async function* ragChat(question: string, options: StreamOptions): AsyncGenerator<SSEEvent> {
  // Step 1: Embed the question
  const queryEmbedding = await embeddingProvider.embed(question);
  
  // Step 2: Retrieve relevant chunks (top-5)
  const chunks = await vectorStore.search(queryEmbedding, { topK: 5, minSimilarity: 0.5 });
  
  // Step 3: Build the prompt
  const systemPrompt = buildRAGPrompt(chunks);
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question }
  ];
  
  // Step 4: Stream LLM response
  yield { event: 'sources', data: chunks.map(c => ({ contentId: c.contentItemId, title: c.title, chunk: c.chunkText })) };
  
  for await (const token of llmProvider.chat(messages, options)) {
    yield { event: 'token', data: { token } };
  }
  
  yield { event: 'done', data: {} };
}
```

### 6. RAG System Prompt Template

```
You are ContentPilot AI, a content assistant for a CMS. Answer the user's question 
using ONLY the context provided below. If the context doesn't contain enough information 
to answer, say so — do not make up information.

When referencing information, cite the source using [Source: {title}] format.

--- CONTEXT ---
{chunks.map(c => `[Source: ${c.title}]\n${c.chunkText}`).join('\n\n')}
--- END CONTEXT ---
```

### 7. SSE Streaming Protocol

The chat endpoint uses Server-Sent Events:

```typescript
// apps/backend/src/modules/ai/controller.ts
export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { question } = req.body;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  
  for await (const event of ragChat(question)) {
    res.write(`event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`);
  }
  
  res.end();
});
```

## Key Configuration Values

| Setting | Default | Notes |
|---------|---------|-------|
| `CHUNK_SIZE` | 2000 chars | ~500 tokens |
| `CHUNK_OVERLAP` | 200 chars | ~50 tokens |
| `RAG_TOP_K` | 5 | Number of chunks to retrieve |
| `RAG_MIN_SIMILARITY` | 0.5 | Minimum cosine similarity threshold |
| `EMBEDDING_DIMENSIONS` | 384 | Must match the embedding model |

## Testing the RAG Pipeline

1. **Unit test chunking** — verify chunk sizes, overlaps, and edge cases (empty content, very short content)
2. **Unit test prompt building** — verify context is properly formatted
3. **Integration test search** — insert known embeddings, verify correct retrieval
4. **E2E test** — publish content → verify it's searchable → verify chat answers correctly

## Common Issues

- **Embedding dimension mismatch**: If you change the embedding model, you MUST update the `vector(N)` column in the Prisma schema AND re-embed all content
- **Empty search results**: Check that content is in `PUBLISHED` status and embeddings were generated
- **Slow embedding**: Use `embedBatch()` for multiple chunks, not individual `embed()` calls
- **pgvector index**: Create an IVFFlat index for faster search at scale: `CREATE INDEX ON content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`
