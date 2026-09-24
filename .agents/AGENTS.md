# ContentPilot AI — Agent Rules

## Project Context
This is **ContentPilot AI**, an AI-Native Headless CMS with RAG Content Assistant & Agentic Personalization. It mirrors Adobe's Experience Cloud (AEM + Target + Analytics) fused with a GenAI layer.

## Critical Rules

1. **Always use TypeScript** — no `.js` files in the project. Strict mode enabled everywhere.
2. **Follow the module pattern** — backend code lives in `apps/backend/src/modules/<module>/` with `routes.ts`, `controller.ts`, `service.ts`, `types.ts`.
3. **Zod for all validation** — API schemas defined with Zod in `packages/shared/src/validators/` and/or module `types.ts`.
4. **AI provider abstraction** — never call Groq/HuggingFace/Ollama directly. Always go through the `LLMProvider` or `EmbeddingProvider` interface.
5. **Free AI models only** — Primary: Groq (llama-3.3-70b), HuggingFace (bge-small-en-v1.5). Fallback: Ollama local. No paid API calls.
6. **Documentation is mandatory** — every API endpoint, module, and architecture decision must be documented in `docs/`.
7. **Human-in-the-loop** — the agent system NEVER auto-publishes content. All AI suggestions require editor approval.
8. **Prisma ORM** — use Prisma for all database operations. Raw SQL only for pgvector-specific queries.
9. **Conventional commits** — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
10. **Update shared types** — when adding/changing API responses, update `packages/shared/src/types/` so frontends stay in sync.

## Tech Stack Quick Reference
- **Monorepo**: Turborepo + pnpm
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Database**: PostgreSQL 16 + pgvector
- **LLM**: Groq API (llama-3.3-70b-versatile)
- **Embeddings**: HuggingFace Inference API (BAAI/bge-small-en-v1.5, 384-dim)
- **Cache**: Redis
- **Testing**: Vitest + React Testing Library
- **DevOps**: Docker + docker-compose + GitHub Actions
