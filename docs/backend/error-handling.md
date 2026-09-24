# Error Handling & Resilience Architecture

## Error Hierarchy

All anticipated operational errors inherit from `AppError`:

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}
```

## Standard Error Response Format

```json
{
  "error": {
    "code": "SLUG_CONFLICT",
    "message": "Content item with slug 'my-post' already exists",
    "status": 409
  }
}
```

Validation errors from Zod automatically produce:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "status": 400,
    "details": {
      "fieldErrors": {
        "title": ["Title cannot exceed 200 characters"]
      }
    }
  }
}
```
