# Getting Started Guide

Get up and running with ContentPilot AI in under 5 minutes.

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose (or local PostgreSQL 16 + Redis)

## Step-by-Step

### 1. Clone & Install
```bash
git clone https://github.com/DevanshGupta099/AI-Native-Headless-CMS-with-RAG-Content-Assistant-Agentic-Personalization.git
cd AI-Native-Headless-CMS-with-RAG-Content-Assistant-Agentic-Personalization
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Optional: Add your free GROQ_API_KEY and HUGGINGFACE_API_KEY
```

### 3. Start Infrastructure
```bash
# Using Docker Compose
docker compose -f docker/docker-compose.yml up postgres redis -d

# Run Prisma database migrations
pnpm --filter @contentpilot/backend prisma:migrate
```

### 4. Run Development Servers
```bash
pnpm dev
```

- Author Studio: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Public Delivery Site: [http://localhost:3002](http://localhost:3002)
