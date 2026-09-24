---
name: api-endpoint
description: |
  Create a new REST API endpoint for ContentPilot AI following the project's conventions.
  Use when adding new endpoints to any module (content, AI, personalization, evaluation, auth).
  Ensures consistent validation, error handling, documentation, and testing.
---

# API Endpoint Creation Skill

## Endpoint Conventions

All endpoints follow these patterns:

### URL Structure
```
/api/<module>             — collection endpoints (GET list, POST create)
/api/<module>/:id         — resource endpoints (GET one, PUT update, DELETE)
/api/<module>/:id/<action> — action endpoints (POST /api/content/:id/publish)
```

### Response Format

**Success (single resource):**
```json
{
  "data": { ... },
  "meta": { "timestamp": "2024-01-01T00:00:00Z" }
}
```

**Success (list):**
```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Error:**
```json
{
  "error": {
    "code": "CONTENT_NOT_FOUND",
    "message": "Content item with ID abc not found",
    "status": 404
  }
}
```

## Step-by-Step: Adding a New Endpoint

### 1. Define the Zod schema in `types.ts`

```typescript
export const CreateItemSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  type: z.enum(['BLOG_POST', 'LANDING_PAGE', 'PRODUCT_PAGE']),
});

export type CreateItemInput = z.infer<typeof CreateItemSchema>;
```

### 2. Add the service method

```typescript
// service.ts
async create(input: CreateItemInput, userId: string): Promise<ContentItemResponse> {
  const slug = generateSlug(input.title);
  const item = await prisma.contentItem.create({
    data: { ...input, slug, createdBy: userId, status: 'DRAFT' },
  });
  return item;
}
```

### 3. Add the controller handler

```typescript
// controller.ts
export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = CreateItemSchema.parse(req.body);
  const userId = req.user!.id; // from auth middleware
  const result = await contentService.create(input, userId);
  res.status(201).json({ data: result, meta: { timestamp: new Date().toISOString() } });
});
```

### 4. Add the route

```typescript
// routes.ts
router.post('/', authenticate, controller.create);
```

### 5. Add to shared types (if consumed by frontend)

```typescript
// packages/shared/src/types/content.ts
export interface ContentItemResponse {
  id: string;
  type: 'BLOG_POST' | 'LANDING_PAGE' | 'PRODUCT_PAGE';
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}
```

### 6. Write tests

```typescript
describe('POST /api/content', () => {
  it('should create a new draft content item', async () => {
    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Post', body: 'Hello world', type: 'BLOG_POST' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('DRAFT');
    expect(res.body.data.slug).toBe('test-post');
  });
});
```

### 7. Document the endpoint

Add to `docs/api-specs/<module>-api.md`:

```markdown
### POST /api/content

Create a new draft content item.

**Auth:** Required (Bearer token)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Content title (1-200 chars) |
| body | string | Yes | Content body |
| type | enum | Yes | BLOG_POST, LANDING_PAGE, or PRODUCT_PAGE |

**Response (201):**
\`\`\`json
{
  "data": {
    "id": "uuid",
    "type": "BLOG_POST",
    "title": "Test Post",
    "slug": "test-post",
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

**Errors:**
| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid request body |
| UNAUTHORIZED | 401 | Missing/invalid auth token |
| SLUG_CONFLICT | 409 | Content with this slug already exists |
```

### 8. Update OpenAPI spec

Add the endpoint definition to `docs/api-specs/openapi.yaml`.

## Middleware Chain

Every request flows through:
1. `cors` — CORS headers
2. `express.json()` — body parsing
3. `rateLimiter` — rate limiting (Redis-backed)
4. `authenticate` — JWT verification (on protected routes)
5. `controller handler` — business logic
6. `errorHandler` — catches AppError and Zod errors, returns structured error response

## Error Handling

```typescript
// apps/backend/src/utils/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
  }
}

// Usage in controllers:
throw new AppError('Content not found', 404, 'CONTENT_NOT_FOUND');

// Zod validation errors are automatically caught and returned as 400
```
