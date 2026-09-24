# AI Pipeline & RAG Architecture

## End-to-End RAG Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Content Editor
    participant AS as Author Studio
    participant API as Backend AI Service
    participant HF as HuggingFace (Embedding)
    participant PGV as PostgreSQL (pgvector)
    participant Groq as Groq (LLM)

    Editor->>AS: Types query in Assistant Widget
    AS->>API: POST /api/assistant/chat (stream=true)
    API->>HF: embed(queryText)
    HF-->>API: 384-dimensional vector
    API->>PGV: SELECT <=> cosine distance (top-k=5)
    PGV-->>API: 5 Ranked content chunks with metadata
    API-->>AS: SSE Event: event: citation (sources payload)
    API->>Groq: Stream chat completion with injected context
    loop Token Streaming
        Groq-->>API: token chunk
        API-->>AS: SSE Event: event: token (data payload)
    end
    API-->>AS: SSE Event: event: done
```

## Agentic "Prep for Publish" Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Content Editor
    participant AS as Author Studio
    participant Orch as Agent Orchestrator
    participant Tool1 as Tool: generate_meta_description
    participant Tool2 as Tool: check_seo_score
    participant Tool3 as Tool: suggest_audience_segment
    participant DB as Audit Log (agent_action_logs)

    Editor->>AS: Clicks "Prep for Publish"
    AS->>Orch: POST /api/assistant/agent/execute {task: "prepare_publish"}
    Note over Orch: Step 1: Meta Description
    Orch->>Tool1: execute(contentId)
    Tool1-->>Orch: { metaDescription, charCount }
    Note over Orch: Step 2: SEO Score Evaluation
    Orch->>Tool2: execute(contentId)
    Tool2-->>Orch: { score: 85, grade: "A", checks: [...] }
    Note over Orch: Step 3: Audience Segment Suggestion
    Orch->>Tool3: execute(contentId)
    Tool3-->>Orch: { segmentId, segmentName, reasoning }
    Orch->>DB: Persist complete trace & step timings
    Orch-->>AS: Return structured summary checklist
    Note over Editor: Human-in-the-loop: Editor reviews & approves
```

## Chunking Strategy

To prevent semantic dilution and context fragmentation, ContentPilot AI uses a recursive token-aware chunking strategy:

1. **Paragraph Splits**: Split along double-newline boundaries (`\n\n`).
2. **Line Splits**: Split along single-newline boundaries (`\n`).
3. **Sentence Splits**: Split along punctuation (`. `, `! `, `? `).
4. **Token Windows**:
   - Primary Chunk Size: ~500 tokens (approx. 2,000 characters).
   - Overlap Size: ~50 tokens (approx. 200 characters) to retain context across chunk boundaries.
   - Minimum Chunk Size: 100 characters (discards empty lines or orphan punctuation).

## Provider Fallback Matrix

| Role | Primary Provider | Primary Model | Fallback Provider | Fallback Model |
|------|------------------|---------------|-------------------|----------------|
| **LLM Inference** | Groq Cloud | `llama-3.3-70b-versatile` | Ollama (Local) | `llama3.2:3b` |
| **Embeddings** | HuggingFace API | `BAAI/bge-small-en-v1.5` | Ollama (Local) | `nomic-embed-text` |
