# ContentPilot AI — Project Conventions & Rules

## Project Identity
- **Name**: ContentPilot AI
- **Type**: AI-Native Headless CMS with RAG Content Assistant & Agentic Personalization
- **Monorepo Tool**: Turborepo with pnpm workspaces
- **Language**: TypeScript (strict mode) everywhere — no plain JS files

## Monorepo Structure
- `apps/backend/` — Express + TypeScript API server
- `apps/author-studio/` — Next.js 15 (App Router) admin UI
- `apps/delivery-site/` — Next.js 15 (SSR/ISR) public site
- `packages/shared/` — Shared types, Zod validators, constants
- `docs/` — All project documentation
- `eval/` — Evaluation datasets and scripts
- `docker/` — Dockerfiles and docker-compose

## Code Style Rules
1. **TypeScript strict mode** in all packages — no `any` types unless explicitly justified with a comment.
2. **Zod validation** for all API request/response schemas — defined in `packages/shared/src/validators/`.
3. **Module-based backend structure** — each domain (`content`, `auth`, `ai`, `personalization`, `evaluation`) lives in `apps/backend/src/modules/<module>/` with its own `routes.ts`, `controller.ts`, `service.ts`, and `types.ts`.
4. **Prisma** as the sole ORM — no raw SQL except for pgvector-specific queries (cosine similarity search).
5. **Error handling** — all controllers use a shared `asyncHandler` wrapper; errors are instances of `AppError` with HTTP status codes.
6. **API versioning** — all routes are prefixed `/api/` (no version prefix for v1; add `/api/v2/` if/when needed).
7. **Environment variables** — accessed only through `apps/backend/src/config/env.ts` using Zod validation, never via raw `process.env`.

## AI Provider Rules
1. **Provider abstraction** — all LLM and embedding calls go through `LLMProvider` and `EmbeddingProvider` interfaces in `apps/backend/src/services/`.
2. **Primary LLM**: Groq API with `llama-3.3-70b-versatile`.
3. **Primary Embeddings**: HuggingFace Inference API with `BAAI/bge-small-en-v1.5` (384 dimensions).
4. **Fallback**: Ollama local for development.
5. **No hardcoded model names** — always read from env config.
6. **Streaming** — LLM chat responses stream via SSE (Server-Sent Events). Use `AsyncGenerator<string>` pattern.
7. **Rate limiting** — implement request queue for Groq (30 RPM limit).

## Database Rules
1. **PostgreSQL 16** with `pgvector` extension.
2. **UUID primary keys** for all tables.
3. **Soft deletes** only for `content_items` (use `status: ARCHIVED`).
4. **All timestamps** use `DateTime` with `@default(now())` and `@updatedAt`.
5. **Embedding dimension**: 384 (matching `bge-small-en-v1.5`).
6. **Vector search**: use cosine distance (`<=>` operator) with IVFFlat index.

## Frontend Rules
1. **Next.js 15 App Router** — use Server Components by default; add `'use client'` only when needed (interactivity, hooks, browser APIs).
2. **Tailwind CSS** for styling — follow a consistent design token system.
3. **API calls** — use a shared API client in `src/lib/api.ts` that handles auth tokens, base URLs, and error parsing.
4. **SSE consumption** — use `EventSource` or `fetch` with `ReadableStream` for chat streaming.
5. **Form validation** — use Zod schemas from `@contentpilot/shared` on both client and server.
6. **No inline styles** — use Tailwind utilities or CSS modules.

## Documentation Rules
1. **Every new module** must have a corresponding doc in `docs/backend/` or `docs/frontend/`.
2. **Every API endpoint** must be documented in `docs/api-specs/` with request/response examples.
3. **Architecture decisions** go in `docs/architecture/`.
4. **Update docs alongside code** — docs are never allowed to drift from implementation.
5. **OpenAPI spec** (`docs/api-specs/openapi.yaml`) is the source of truth for the REST API.

## Testing Rules
1. **Vitest** for unit and integration tests.
2. **React Testing Library** for frontend component tests.
3. **Test files** live next to source files: `service.ts` → `service.test.ts`.
4. **API integration tests** use a real test database (Docker-based).
5. **Minimum coverage targets**: 80% for backend services, 70% for frontend components.

## Git & CI Rules
1. **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
2. **Branch naming**: `feat/content-service`, `fix/sse-reconnection`, `docs/api-specs`.
3. **GitHub Actions** CI runs on every PR: lint → typecheck → test → build.
4. **No secrets in code** — use `.env` files (`.env.example` committed, `.env` gitignored).
