# Background Jobs & Queue Architecture

## BullMQ & Redis Integration

Content embedding and vector indexing occur asynchronously to prevent blocking the content editor during publishing.

```mermaid
flowchart LR
    A[Content Published] -->|Enqueue embed-content| B[(Redis Queue)]
    B -->|Dequeue| C[Embedding Worker]
    C -->|Chunk Text| D[Text Splitter]
    D -->|Batch Embed| E[Embedding Provider]
    E -->|Write Vectors| F[(PostgreSQL pgvector)]
```

## Queue Configuration

- **Queue Name**: `embedding-pipeline`
- **Concurrency**: 3 jobs concurrently.
- **Retry Strategy**: Exponential backoff with 3 retries (10s, 30s, 90s).
