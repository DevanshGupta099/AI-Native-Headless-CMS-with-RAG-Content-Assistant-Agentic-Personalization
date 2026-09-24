---
name: backend-module
description: |
  Create a new backend module for ContentPilot AI following the established module pattern.
  Use when adding a new domain feature (e.g., analytics, notifications) or when the user
  asks to "create a new module" or "add a new feature domain" to the backend.
---

# Backend Module Creation Skill

## Module Structure

Every backend module lives in `apps/backend/src/modules/<module-name>/` and follows this exact structure:

```
apps/backend/src/modules/<module-name>/
├── routes.ts         # Express router with all endpoints
├── controller.ts     # Request handling — parses input, calls service, sends response
├── service.ts        # Business logic — the core of the module
├── types.ts          # Module-specific TypeScript types
└── <module>.test.ts  # Tests (Vitest)
```

## Implementation Steps

### 1. Create the Types file (`types.ts`)

Define all request/response types and any module-specific interfaces:

```typescript
// apps/backend/src/modules/<module>/types.ts
import { z } from 'zod';

export const Create<Module>Schema = z.object({
  // ... fields
});

export type Create<Module>Input = z.infer<typeof Create<Module>Schema>;

export const <Module>ResponseSchema = z.object({
  id: z.string().uuid(),
  // ... fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type <Module>Response = z.infer<typeof <Module>ResponseSchema>;
```

### 2. Create the Service file (`service.ts`)

Contains all business logic. Uses Prisma for DB access:

```typescript
// apps/backend/src/modules/<module>/service.ts
import { prisma } from '../../config/database';
import { Create<Module>Input, <Module>Response } from './types';

export class <Module>Service {
  async create(input: Create<Module>Input): Promise<<Module>Response> {
    const result = await prisma.<model>.create({ data: input });
    return result;
  }

  async getById(id: string): Promise<<Module>Response | null> {
    return prisma.<model>.findUnique({ where: { id } });
  }

  async list(filters?: Record<string, unknown>): Promise<<Module>Response[]> {
    return prisma.<model>.findMany({ where: filters });
  }
}

export const <module>Service = new <Module>Service();
```

### 3. Create the Controller file (`controller.ts`)

Thin layer — validates input, calls service, returns response:

```typescript
// apps/backend/src/modules/<module>/controller.ts
import { Request, Response } from 'express';
import { <module>Service } from './service';
import { Create<Module>Schema } from './types';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AppError } from '../../utils/AppError';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = Create<Module>Schema.parse(req.body);
  const result = await <module>Service.create(input);
  res.status(201).json(result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await <module>Service.getById(id);
  if (!result) throw new AppError('Not found', 404);
  res.json(result);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const results = await <module>Service.list(req.query);
  res.json(results);
});
```

### 4. Create the Routes file (`routes.ts`)

```typescript
// apps/backend/src/modules/<module>/routes.ts
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as controller from './controller';

const router = Router();

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.getById);

export default router;
```

### 5. Register in the main app

Add the router to `apps/backend/src/app.ts`:

```typescript
import <module>Routes from './modules/<module>/routes';
app.use('/api/<module>', <module>Routes);
```

### 6. Create the test file

```typescript
// apps/backend/src/modules/<module>/<module>.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { <Module>Service } from './service';

describe('<Module>Service', () => {
  // ... tests
});
```

### 7. Create Documentation

Add `docs/api-specs/<module>-api.md` with:
- Endpoint table
- Request/response examples
- Error codes
- Auth requirements

## Checklist

- [ ] Types defined with Zod schemas in `types.ts`
- [ ] Service with business logic in `service.ts`
- [ ] Controller with validation in `controller.ts`
- [ ] Routes registered in `routes.ts`
- [ ] Routes mounted in `app.ts`
- [ ] Tests written in `<module>.test.ts`
- [ ] API documentation added to `docs/api-specs/`
- [ ] Shared types exported from `packages/shared/` if needed by frontend
