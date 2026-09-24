# System Overview Architecture

## Introduction

**ContentPilot AI** is an AI-Native Headless CMS featuring an intelligent Retrieval-Augmented Generation (RAG) assistant, automated publishing preparation via agentic tool calling, and segment-based real-time personalization. It maps directly to enterprise customer experience platforms like Adobe Experience Manager (AEM), Adobe Target, and Adobe Analytics.

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Client Layer
        AS["Author Studio (Next.js 15 Admin UI)"]
        DS["Delivery Site (Next.js 15 SSR/ISR)"]
        CW["Streaming Chat Widget (SSE)"]
    end

    subgraph API Gateway & Backend ["Backend API (Node.js + Express + TypeScript)"]
        AuthM["Auth Module (JWT)"]
        ContentM["Content Service (CRUD & Workflow)"]
        AIO["AI Orchestration Service"]
        PersM["Personalization Engine"]
        EvalM["Evaluation Service"]
    end

    subgraph Data & Cache Layer
        PG[("PostgreSQL 16\nRelational Data")]
        PGV[("pgvector Extension\nContent Embeddings (384-dim)")]
        RD[("Redis 7\nQueue & Rate Limiting")]
    end

    subgraph External AI Services ["Free AI Provider Tier"]
        Groq["Groq Cloud API\nllama-3.3-70b-versatile"]
        HF["HuggingFace Inference API\nBAAI/bge-small-en-v1.5"]
        Ollama["Local Ollama Fallback\nllama3.2 & nomic-embed"]
    end

    AS -->|REST API| AuthM
    AS -->|REST API| ContentM
    AS -->|Tool Execution| AIO
    CW -->|SSE Stream| AIO
    DS -->|Variant Resolution| PersM

    ContentM -->|Triggers on Publish| RD
    RD -->|Worker Consumer| AIO
    AIO -->|Vector Search| PGV
    AIO -->|Chat & Tools| Groq
    AIO -->|Embedding Generation| HF
    ContentM -->|Transactions| PG
    PersM -->|Rules & Impressions| PG
    EvalM -->|Scores & History| PG

    Groq -.->|Fallback| Ollama
    HF -.->|Fallback| Ollama
```

## Component Responsibilities

### 1. Content Service
- **Domain**: Content creation, draft authoring, metadata management, version snapshotting, state machine (`DRAFT` → `PUBLISHED` → `ARCHIVED`).
- **Storage**: `content_items` and `content_versions` in PostgreSQL.
- **Publish Trigger**: Dispatches asynchronous indexing tasks to the Redis BullMQ queue upon publication.

### 2. Embedding & Indexing Pipeline
- **Decoupled execution**: Content publishing completes immediately without waiting for embedding generation.
- **Processing**: Breaks long-form content into overlapping chunks (~500 tokens, 50-token overlap).
- **Vector Storage**: Emits 384-dimensional dense vectors to PostgreSQL via `pgvector` with IVFFlat indexing.

### 3. AI Orchestration Service
- **Semantic Search**: Converts natural language queries into embeddings and queries pgvector using cosine distance (`<=>`).
- **RAG-Grounded Chat**: Injects top-k relevant chunks into a strict system prompt and streams token-by-token responses via Server-Sent Events (SSE) with source citations.
- **Agent Orchestrator**: Executes sequential tool workflows (`generate_meta_description`, `check_seo_score`, `suggest_audience_segment`) while recording full execution traces.

### 4. Personalization Engine
- **Visitor Segmentation**: Evaluates rule expressions (e.g., visitor type, traffic referrer, campaign parameters).
- **Variant Delivery**: Serves segment-tailored content variations with sub-millisecond overhead.
- **Impression Tracking**: Persists delivery telemetry into the `impressions` table for downstream analytics and personalization correctness evaluation.

### 5. Evaluation Harness
- Computes empirical metrics:
  - **Retrieval Precision@k / Recall@k** against ground-truth query benchmarks.
  - **Agent Completion Rate** based on successful execution of planned tool steps.
  - **Streaming Time-to-First-Token (TTFT)**.
