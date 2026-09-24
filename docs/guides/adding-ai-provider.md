# Adding a New AI Provider

1. Implement `LLMProvider` or `EmbeddingProvider` in `apps/backend/src/services/`.
2. Register the provider in the factory function (`apps/backend/src/services/llm/index.ts` or `embedding/index.ts`).
3. Add the provider configuration schema to `apps/backend/src/config/env.ts`.
4. Update `.env.example` and this guide.
