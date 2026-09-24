# Backend Module Structure

## Module Pattern

Every backend feature domain is encapsulated within `apps/backend/src/modules/<module-name>/`.

```
apps/backend/src/modules/<module-name>/
├── routes.ts         # Express router and middleware wiring
├── controller.ts     # Request validation, service invocation, and HTTP response
├── service.ts        # Pure domain business logic & Prisma database interactions
├── types.ts          # Module input/output TypeScript contracts & Zod schemas
└── <module>.test.ts  # Vitest integration and unit tests
```

## Existing Modules

1. **`auth`**: Handles user authentication, token issuance, password hashing, and role checks.
2. **`content`**: Manages content CRUD, slug auto-generation, version snapshots, and publishing triggers.
3. **`ai`**: Orchestrates semantic vector search, streaming RAG chat, and multi-step agent tool planning.
4. **`personalization`**: Evaluates segment rules against visitor contexts and resolves tailored content variants.
5. **`evaluation`**: Executes precision@k and agent completion reliability benchmarks.
