# Auth API Specification

Lightweight JWT-based authentication for ContentPilot authors, editors, and administrators.

## Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Create a new user account | None (or Admin) |
| `POST` | `/api/auth/login` | Login with email and password | None |
| `GET` | `/api/auth/me` | Retrieve the authenticated user session profile | Yes (Bearer) |

---

### POST `/api/auth/login`

#### Request Body
```json
{
  "email": "editor@contentpilot.ai",
  "password": "Password123!"
}
```

#### Response `200 OK`
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid-1",
      "name": "Jane Editor",
      "email": "editor@contentpilot.ai",
      "role": "EDITOR"
    }
  }
}
```
