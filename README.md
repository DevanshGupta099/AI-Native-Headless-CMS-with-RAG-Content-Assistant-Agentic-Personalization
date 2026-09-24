# ContentPilot AI

> **AI-Native Headless CMS with RAG Content Assistant & Agentic Personalization**
> An enterprise-grade CMS platform mirroring Adobe Experience Cloud (AEM + Target + Analytics) powered by free and open-source GenAI models.

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444.svg)](https://turbo.build/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20+%20pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2D3748.svg)](https://www.prisma.io/)
[![Groq](https://img.shields.io/badge/LLM-Groq%20Cloud-f55036.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Key Highlights

1. **Enterprise Headless CMS Core**: Complete content authoring lifecycle with version snapshots, audit trails, and draft-to-publish state machines.
2. **Automated Vector Embedding**: Zero-friction background indexing on publish using PostgreSQL `pgvector` and HuggingFace's `bge-small-en-v1.5` (384 dimensions).
3. **Grounded RAG Assistant**: Streaming conversational copilot with Server-Sent Events (SSE) and clickable source citations.
4. **Agentic "Prep for Publish"**: Multi-step tool-calling pipeline that generates SEO meta descriptions, audits content quality, and suggests target audience segments — with human-in-the-loop approvals.
5. **Rule-Based Dynamic Personalization**: Sub-millisecond visitor segment evaluation and variant delivery with impression tracking.
6. **100% Free AI Tier**: Engineered to operate on zero API budget using Groq (`llama-3.3-70b-versatile`), HuggingFace Inference API, and local Ollama fallback.

---

## 🏗️ Architecture & Monorepo Layout

```
.
├── apps/
│   ├── backend/                # Express + TypeScript API server & AI orchestration
│   ├── author-studio/          # Next.js 15 App Router admin dashboard
│   └── delivery-site/          # Next.js 15 SSR/ISR public web delivery
├── packages/
│   └── shared/                 # Shared TypeScript types, Zod schemas, constants
├── docs/                       # Complete system documentation
│   ├── architecture/           # System diagrams, data model, AI pipeline, deployment
│   ├── api-specs/              # OpenAPI 3.1 & domain-specific REST specs
│   ├── frontend/               # Author Studio & Delivery Site architecture
│   ├── backend/                # Module patterns, AI providers, job queues
│   └── guides/                 # Getting started, local dev, extending types
└── docker/                     # Multi-service docker-compose setup
```

---

## 🚀 Quick Start (Docker)

```bash
# 1. Clone repository
git clone https://github.com/DevanshGupta099/AI-Native-Headless-CMS-with-RAG-Content-Assistant-Agentic-Personalization.git
cd AI-Native-Headless-CMS-with-RAG-Content-Assistant-Agentic-Personalization

# 2. Configure environment
cp .env.example .env

# 3. Launch the complete system
docker compose -f docker/docker-compose.yml up --build
```

### Port Map
- **Author Studio (Admin)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Delivery Site (Public)**: [http://localhost:3002](http://localhost:3002)
- **PostgreSQL + pgvector**: `localhost:5432`
- **Redis Cache & Queue**: `localhost:6379`

---

## 📖 Complete Documentation

- [System Architecture](docs/architecture/system-overview.md)
- [Data Model & Schema](docs/architecture/data-model.md)
- [AI Pipeline & RAG Sequence](docs/architecture/ai-pipeline.md)
- [Personalization Engine](docs/architecture/personalization-engine.md)
- [OpenAPI Specification](docs/api-specs/openapi.yaml)
- [Content API](docs/api-specs/content-api.md)
- [AI Assistant API](docs/api-specs/ai-assistant-api.md)
- [Personalization API](docs/api-specs/personalization-api.md)
- [Evaluation API](docs/api-specs/evaluation-api.md)
- [Getting Started Guide](docs/guides/getting-started.md)
