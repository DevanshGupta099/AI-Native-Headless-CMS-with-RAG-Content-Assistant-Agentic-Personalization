# Personalization API Specification

Manages audience segments, personalized content variations, and the runtime variant delivery engine.

## Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/personalize/segments` | Create or update an audience segment rule | Yes (Bearer) |
| `GET` | `/api/personalize/segments` | List all audience segments | Yes (Bearer) |
| `POST` | `/api/personalize/variants` | Create a tailored content variant for a segment | Yes (Bearer) |
| `GET` | `/api/personalize/deliver` | Resolve and return the personalized variant for a visitor | None |

---

### POST `/api/personalize/segments`

#### Request Body
```json
{
  "name": "Returning Enterprise Buyers",
  "ruleJson": {
    "operator": "AND",
    "conditions": [
      { "field": "isNewVisitor", "operator": "eq", "value": false },
      { "field": "industry", "operator": "eq", "value": "enterprise" }
    ]
  }
}
```

---

### GET `/api/personalize/deliver`

Resolves the best matching variant for the visitor session. If no rule matches, serves fallback content.

#### Query Parameters
- `contentId` (UUID, required): Target content item.
- `sessionId` (String, required): Visitor session token.
- `referrer` (String, optional): HTTP referrer.
- `isNewVisitor` (Boolean, optional): Visitor state flag.

#### Response `200 OK`
```json
{
  "data": {
    "contentItemId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "servedVariantId": "variant-uuid-456",
    "matchedSegmentId": "segment-uuid-returning",
    "isFallback": false,
    "body": {
      "headline": "Welcome back! Ready to scale your enterprise content?",
      "cta": "Upgrade your tier"
    }
  }
}
```
