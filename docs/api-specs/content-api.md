# Content Service API Specification

The Content Service provides full CRUD, versioning, and publishing workflows for structured content items.

## Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/content` | Create a new draft content item | Yes (Bearer) |
| `GET` | `/api/content` | List content items with optional filters | Yes (Bearer) |
| `GET` | `/api/content/:id` | Get content item details + latest version | Yes (Bearer) |
| `PUT` | `/api/content/:id` | Update draft content & create new version | Yes (Bearer) |
| `POST` | `/api/content/:id/publish` | Publish content and trigger auto-embedding | Yes (Bearer) |
| `GET` | `/api/content/:id/versions` | List all historical versions of content | Yes (Bearer) |
| `DELETE` | `/api/content/:id` | Archive content item (soft delete) | Yes (Bearer) |

---

### POST `/api/content`

Create a new content item in `DRAFT` status.

#### Request Body
```json
{
  "type": "BLOG_POST",
  "title": "Getting Started with Agentic Personalization",
  "body": {
    "blocks": [
      {
        "type": "paragraph",
        "text": "Agentic personalization represents the next evolutionary step in CMS..."
      }
    ]
  },
  "meta": {
    "tags": ["AI", "CMS", "Personalization"]
  }
}
```

#### Response `201 Created`
```json
{
  "data": {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "type": "BLOG_POST",
    "title": "Getting Started with Agentic Personalization",
    "slug": "getting-started-with-agentic-personalization",
    "status": "DRAFT",
    "createdBy": "user-uuid",
    "createdAt": "2026-09-24T12:00:00.000Z",
    "updatedAt": "2026-09-24T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-09-24T12:00:00.000Z"
  }
}
```

---

### POST `/api/content/:id/publish`

Transitions status from `DRAFT` to `PUBLISHED` and queues background vector embedding.

#### Response `200 OK`
```json
{
  "data": {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "status": "PUBLISHED",
    "publishedAt": "2026-09-24T12:05:00.000Z",
    "jobId": "embed-job-101"
  }
}
```
