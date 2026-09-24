# Documentation Standards

## Mandatory Documentation

Every feature, module, or system component **must** have documentation maintained in the `docs/` directory. Documentation is a first-class deliverable, not an afterthought.

## Documentation Categories

### 1. Architecture Documentation (`docs/architecture/`)
- **system-overview.md** — High-level system architecture with Mermaid diagrams showing all services, data flows, and external dependencies.
- **data-model.md** — Entity-Relationship Diagram (ERD), table descriptions, column purposes, and relationships. Must reflect the current Prisma schema.
- **ai-pipeline.md** — Embedding pipeline, RAG retrieval flow, agent orchestration, chunking strategy, and provider abstraction details.
- **personalization-engine.md** — Segment rule evaluation logic, variant resolution algorithm, impression tracking.
- **deployment.md** — Docker setup, environment variables, CI/CD pipeline, production deployment guide.

### 2. API Specification (`docs/api-specs/`)
- **openapi.yaml** — OpenAPI 3.1 specification. Must be kept in sync with actual Express routes.
- **Per-domain API docs** — Each API domain (content, AI, personalization, evaluation, auth) has a dedicated markdown file with:
  - Endpoint table (method, path, purpose)
  - Request/response JSON examples
  - Error codes and meanings
  - Authentication requirements
  - Rate limiting details

### 3. Frontend Documentation (`docs/frontend/`)
- **author-studio.md** — Component tree, page routing structure, state management approach, authentication flow.
- **delivery-site.md** — SSR/ISR rendering strategy, dynamic routing, personalization integration.
- **chat-widget.md** — SSE streaming protocol, message types, reconnection logic, UI states.
- **design-system.md** — Tailwind theme tokens (colors, typography, spacing), reusable component library.

### 4. Backend Documentation (`docs/backend/`)
- **module-structure.md** — Module organization pattern, dependency injection, service layer architecture.
- **ai-providers.md** — How the provider abstraction works, supported providers, how to add new ones.
- **background-jobs.md** — BullMQ job queue architecture, job types, retry policies, monitoring.
- **error-handling.md** — Error classes, HTTP status mapping, error response format, logging strategy.

### 5. Developer Guides (`docs/guides/`)
- **getting-started.md** — Clone, install, configure, run in under 5 minutes.
- **local-development.md** — Development without Docker, using Ollama for local AI.
- **adding-ai-provider.md** — Step-by-step guide to implement a new LLM or embedding provider.
- **creating-content-types.md** — How to extend the content type enum and add new schemas.
- **evaluation-guide.md** — How to create test queries, run evals, and interpret scores.

## Documentation Format Rules

1. **Use Mermaid diagrams** for architecture, data flow, and sequence diagrams.
2. **Include code examples** — every API doc must have copy-pasteable curl/fetch examples.
3. **Version documentation** — note which version of the system the doc applies to.
4. **Link to source code** — reference actual file paths when discussing implementation.
5. **Keep it concise** — prefer tables and bullet points over long paragraphs.
6. **Update trigger** — any PR that changes an API endpoint, schema, or architecture MUST include doc updates.
