# Deployment & Infrastructure Architecture

## Architecture

ContentPilot AI is fully containerized with Docker and orchestrated via Docker Compose.

```
┌────────────────────────────────────────────────────────┐
│                   Docker Host Network                  │
│                                                        │
│   ┌─────────────────────┐    ┌─────────────────────┐   │
│   │    Author Studio    │    │    Delivery Site    │   │
│   │    Port 3000        │    │    Port 3002        │   │
│   └──────────┬──────────┘    └──────────┬──────────┘   │
│              │                          │              │
│              └────────────┬─────────────┘              │
│                           ▼                            │
│              ┌─────────────────────────┐               │
│              │       Backend API       │               │
│              │       Port 3001         │               │
│              └───────┬──────────┬──────┘               │
│                      │          │                      │
│        ┌─────────────┘          └─────────────┐        │
│        ▼                                      ▼        │
│  ┌────────────┐                         ┌───────────┐  │
│  │ PostgreSQL │                         │   Redis   │  │
│  │ + pgvector │                         │ Port 6379 │  │
│  │ Port 5432  │                         └───────────┘  │
│  └────────────┘                                        │
└────────────────────────────────────────────────────────┘
```

## Quick Start (One Command)

```bash
# 1. Clone repository
git clone https://github.com/DevanshGupta099/AI-Native-Headless-CMS-with-RAG-Content-Assistant-Agentic-Personalization.git
cd AI-Native-Headless-CMS-with-RAG-Content-Assistant-Agentic-Personalization

# 2. Configure environment
cp .env.example .env

# 3. Launch with Docker Compose
docker compose -f docker/docker-compose.yml up --build
```

## Service Port Map

| Container | Internal Port | Host Port | Purpose | Health Check |
|-----------|---------------|-----------|---------|--------------|
| `contentpilot-db` | 5432 | 5432 | PostgreSQL 16 + pgvector | `pg_isready -U contentpilot` |
| `contentpilot-redis` | 6379 | 6379 | Redis 7 Job Queue & Cache | `redis-cli ping` |
| `contentpilot-backend` | 3001 | 3001 | Express API Gateway | `GET /health` |
| `contentpilot-author-studio` | 3000 | 3000 | Next.js 15 Admin Console | `GET /` |
| `contentpilot-delivery-site` | 3002 | 3002 | Next.js 15 Public Portal | `GET /` |
