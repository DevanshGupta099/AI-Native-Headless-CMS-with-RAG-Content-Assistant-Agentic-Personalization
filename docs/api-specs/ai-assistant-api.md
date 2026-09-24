# AI Assistant & RAG API Specification

Endpoints for semantic search, RAG-grounded streaming conversational assistant, and multi-step agent workflows.

## Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/assistant/search` | Semantic vector search over published content | Optional |
| `POST` | `/api/assistant/chat` | RAG-grounded streaming chat (SSE) | Optional |
| `POST` | `/api/assistant/agent/execute` | Run multi-step agent workflow ("Prep for Publish") | Yes (Bearer) |
| `GET` | `/api/assistant/agent/logs/:id` | Fetch full execution trace for an agent run | Yes (Bearer) |

---

### POST `/api/assistant/search`

Performs dense vector retrieval against `content_embeddings` using cosine distance.

#### Request Body
```json
{
  "query": "How does audience segmentation work?",
  "topK": 5,
  "minSimilarity": 0.5
}
```

#### Response `200 OK`
```json
{
  "data": [
    {
      "id": "emb-uuid-1",
      "contentItemId": "content-uuid-1",
      "title": "Audience Personalization Primer",
      "slug": "audience-personalization-primer",
      "chunkIndex": 0,
      "chunkText": "Audience segmentation evaluates visitor traits against predefined rules...",
      "similarity": 0.892
    }
  ]
}
```

---

### POST `/api/assistant/chat`

Server-Sent Events (SSE) streaming assistant. Returns both citation metadata and streaming answer tokens.

#### Request Body
```json
{
  "question": "What content types does ContentPilot support?",
  "stream": true
}
```

#### SSE Stream Events
```
event: sources
data: [{"contentId":"uuid-1","title":"Architecture Guide","slug":"architecture-guide","chunkText":"ContentPilot supports BLOG_POST, LANDING_PAGE...","similarity":0.91}]

event: token
data: {"token":"ContentPilot"}

event: token
data: {"token":" supports"}

event: token
data: {"token":" three"}

event: token
data: {"token":" main"}

event: token
data: {"token":" content"}

event: token
data: {"token":" types: [Source: Architecture Guide]"}

event: done
data: {}
```

---

### POST `/api/assistant/agent/execute`

Executes the sequential agentic pipeline for publish preparation.

#### Request Body
```json
{
  "task": "prepare_publish",
  "contentId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

#### Response `200 OK`
```json
{
  "data": {
    "runId": "agent-run-123",
    "task": "prepare_publish",
    "status": "completed",
    "summary": {
      "metaDescription": {
        "metaDescription": "Explore how agentic personalization and RAG redefine headless CMS.",
        "charCount": 68
      },
      "seoScore": {
        "score": 85,
        "grade": "A",
        "checks": [
          { "name": "Title Length", "pass": true, "detail": "52 chars" },
          { "name": "Meta Description", "pass": true, "detail": "Present" }
        ]
      },
      "audienceSegment": {
        "segmentId": "segment-uuid-new-visitor",
        "segmentName": "New Visitors",
        "reasoning": "The introductory tone and foundational overview cater best to first-time readers."
      }
    }
  }
}
```
