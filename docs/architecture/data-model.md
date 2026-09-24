# Data Model & Schema Architecture

## Entity-Relationship Diagram

```mermaid
erDiagram
    users ||--o{ content_items : "creates"
    users ||--o{ agent_action_logs : "triggers"
    content_items ||--o{ content_versions : "has version history"
    content_items ||--o{ content_embeddings : "indexes into vectors"
    content_items ||--o{ content_variants : "has personalized variants"
    content_items ||--o{ impressions : "logged on delivery"
    segments ||--o{ content_variants : "defines target rules for"
    segments ||--o{ impressions : "matches visitor to"
    content_variants ||--o{ impressions : "records delivery of"

    users {
        uuid id PK
        string name
        string email UK
        string password
        enum role "ADMIN | EDITOR"
        timestamp created_at
        timestamp updated_at
    }

    content_items {
        uuid id PK
        enum type "BLOG_POST | LANDING_PAGE | PRODUCT_PAGE"
        string title
        string slug UK
        enum status "DRAFT | PUBLISHED | ARCHIVED"
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    content_versions {
        uuid id PK
        uuid content_item_id FK
        int version_no
        jsonb body_json
        jsonb meta_json
        timestamp created_at
    }

    content_embeddings {
        uuid id PK
        uuid content_item_id FK
        int chunk_index
        text chunk_text
        vector_384 embedding
        timestamp created_at
    }

    segments {
        uuid id PK
        string name UK
        jsonb rule_json
    }

    content_variants {
        uuid id PK
        uuid content_item_id FK
        uuid segment_id FK
        jsonb variant_body_json
    }

    agent_action_logs {
        uuid id PK
        string task
        uuid content_id
        uuid user_id FK
        jsonb steps_json
        jsonb result_json
        string status
        timestamp created_at
    }

    eval_results {
        uuid id PK
        string eval_type
        uuid target_id
        float score
        jsonb details_json
        timestamp created_at
    }

    impressions {
        uuid id PK
        uuid content_item_id FK
        uuid segment_id FK
        uuid variant_id FK
        string session_id
        timestamp timestamp
    }
```

## Entity Details

### 1. `users`
Stores authenticated users (authors, editors, admins).
- `id`: UUID primary key.
- `role`: Role-based access control (`ADMIN` or `EDITOR`).
- `password`: Hashed with bcrypt (cost factor 10).

### 2. `content_items`
Core content registry representing a business document.
- `slug`: Unique human-readable URL identifier.
- `status`: Lifecycle state (`DRAFT`, `PUBLISHED`, `ARCHIVED`). Archiving acts as a soft-delete mechanism.

### 3. `content_versions`
Immutable version snapshots for audit trails and rollback capability.
- `version_no`: Increments per modification.
- `body_json`: Structured rich-text or component AST.
- `meta_json`: SEO title, description, keywords, OpenGraph properties.

### 4. `content_embeddings`
Dense vector representations supporting RAG semantic retrieval.
- `embedding`: Vector of 384 floating-point dimensions (`BAAI/bge-small-en-v1.5`).
- Indexed with PostgreSQL's IVFFlat cosine index:
  ```sql
  CREATE INDEX idx_content_embeddings_cosine 
  ON content_embeddings USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);
  ```

### 5. `segments` & `content_variants`
Configurable rules and content variations for audience personalization.
- `rule_json`: Rule conditions such as `{"field": "isNewVisitor", "op": "eq", "value": true}`.
- `content_variants`: Overrides content body components for visitors matching the corresponding segment.

### 6. `agent_action_logs`
Audit log for autonomous AI agent executions.
- `steps_json`: Array recording every tool execution with input parameters, tool name, execution time, and raw output.
- `status`: `'completed'`, `'failed'`, or `'partial'`.

### 7. `impressions` & `eval_results`
Telemetry and analytics feedback loop.
- Records real-time page impressions to calculate personalization accuracy and audience reach.
- Evaluates retrieval precision@k and agent reliability benchmarks over time.
