# Evaluation API Specification

Provides automated benchmarking and history tracking for RAG retrieval quality, agent reliability, and personalization accuracy.

## Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/eval/run` | Execute an evaluation batch | Yes (Admin/Editor) |
| `GET` | `/api/eval/results` | Query historical evaluation run scores | Yes (Admin/Editor) |
| `GET` | `/api/eval/summary` | Get latest benchmark scores for all 3 categories | Yes (Admin/Editor) |

---

### POST `/api/eval/run`

#### Request Body
```json
{
  "evalType": "retrieval_precision",
  "sampleSize": 20
}
```

#### Response `200 OK`
```json
{
  "data": {
    "id": "eval-run-uuid-789",
    "evalType": "retrieval_precision",
    "score": 0.85,
    "details": {
      "queriesEvaluated": 20,
      "topK": 5,
      "meanPrecision": 0.85,
      "meanRecall": 0.90
    },
    "createdAt": "2026-09-24T12:00:00.000Z"
  }
}
```
