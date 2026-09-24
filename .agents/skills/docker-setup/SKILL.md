---
name: docker-setup
description: |
  Set up, configure, or troubleshoot the Docker development environment for ContentPilot AI.
  Use when creating Dockerfiles, docker-compose configs, or debugging container issues.
  Covers PostgreSQL + pgvector, Redis, backend, and frontend containers.
---

# Docker Setup Skill

## Docker Compose Architecture

All services run via a single `docker-compose up` command:

```
docker/
├── Dockerfile.backend
├── Dockerfile.author-studio
├── Dockerfile.delivery-site
└── docker-compose.yml
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    container_name: contentpilot-db
    environment:
      POSTGRES_USER: contentpilot
      POSTGRES_PASSWORD: contentpilot_dev
      POSTGRES_DB: contentpilot
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U contentpilot"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: contentpilot-redis
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    container_name: contentpilot-backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://contentpilot:contentpilot_dev@postgres:5432/contentpilot?schema=public
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    env_file:
      - ../.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ../apps/backend/src:/app/apps/backend/src  # Hot reload in dev

  author-studio:
    build:
      context: ..
      dockerfile: docker/Dockerfile.author-studio
    container_name: contentpilot-author-studio
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend

  delivery-site:
    build:
      context: ..
      dockerfile: docker/Dockerfile.delivery-site
    container_name: contentpilot-delivery-site
    ports:
      - "3002:3002"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - backend

volumes:
  pgdata:
  redisdata:
```

## Dockerfile Templates

### Backend Dockerfile

```dockerfile
# docker/Dockerfile.backend
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml turbo.json package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile

COPY packages/shared/ ./packages/shared/
COPY apps/backend/ ./apps/backend/

RUN pnpm --filter @contentpilot/shared build
RUN pnpm --filter @contentpilot/backend prisma generate

EXPOSE 3001
CMD ["pnpm", "--filter", "@contentpilot/backend", "dev"]
```

### Next.js App Dockerfile (Author Studio / Delivery Site)

```dockerfile
# docker/Dockerfile.author-studio
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml turbo.json package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/author-studio/package.json ./apps/author-studio/

RUN pnpm install --frozen-lockfile

COPY packages/shared/ ./packages/shared/
COPY apps/author-studio/ ./apps/author-studio/

RUN pnpm --filter @contentpilot/shared build

EXPOSE 3000
CMD ["pnpm", "--filter", "@contentpilot/author-studio", "dev"]
```

## pgvector Setup

The `pgvector/pgvector:pg16` image includes pgvector pre-installed. Enable the extension in Prisma migrations:

```sql
-- In the first Prisma migration
CREATE EXTENSION IF NOT EXISTS vector;
```

In `prisma/schema.prisma`, add:
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}
```

## Development Workflow

```bash
# Start infrastructure only (for local dev without Docker for apps)
docker compose -f docker/docker-compose.yml up postgres redis

# Start everything
docker compose -f docker/docker-compose.yml up --build

# Reset database
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build

# View logs
docker compose -f docker/docker-compose.yml logs -f backend
```

## Port Map

| Service | Port | URL |
|---------|------|-----|
| Author Studio | 3000 | http://localhost:3000 |
| Backend API | 3001 | http://localhost:3001 |
| Delivery Site | 3002 | http://localhost:3002 |
| PostgreSQL | 5432 | postgresql://localhost:5432 |
| Redis | 6379 | redis://localhost:6379 |
