ContentPilot AI
AI-Native Headless CMS with RAG Content Assistant & Agentic Personalization
A full project specification, purpose-built to mirror the technical surface area of Adobe's Experience Cloud consulting stack (AEM + Target + Analytics-style personalization), fused with a modern GenAI layer.

1. Problem Statement
Enterprise content teams manage huge volumes of content across CMS platforms but struggle to search, understand, personalize, and prepare that content efficiently at scale. This is the exact problem Adobe's Experience Cloud (AEM, Target, Analytics) and its consulting arm (ACS) exist to solve for clients — but the underlying challenge is universal:

How do you make content easy to create, easy to discover, adaptable to different audiences, and continuously improved using AI — while still keeping a human in the loop for quality, tone, and brand ownership?

ContentPilot AI answers this by building a compact, real, working version of that stack: a headless CMS with an AI assistant that can find content (RAG), prepare content for publishing (agentic tool-calling), and personalize content delivery to different audience segments — with every AI action logged, evaluated, and explainable.

2. Problem Description
A typical mid-size content team hits these pain points:

Content silos — nobody can quickly answer "do we already have content about X?" without manually searching folders.
Manual, repetitive publish prep — writing meta descriptions, checking SEO basics, and tagging audience segments is done by hand, every time, for every piece of content.
Personalization requires developer involvement — showing a different hero banner to a "new visitor" vs a "returning customer" usually means a ticket to engineering, not something a content editor can do themselves.
No feedback loop — teams rarely measure whether an AI-assisted or personalized piece of content actually performed better; changes go out un-evaluated.
ContentPilot AI is scoped to solve all four directly, in a single coherent system rather than four disconnected demos.

3. Goals & Outcomes
What building and shipping this demonstrates, mapped to real hiring signal:

Outcome	Why it matters
End-to-end CMS domain modeling (content types, versioning, publish workflow)	Shows you understand what a Content Management System actually is, not just that you can call an LLM API
Working RAG pipeline (chunking → embeddings → vector search → grounded generation)	Directly demonstrates the JD's "RAG Fundamentals" and "Embeddings & Vector Search" line items
Agentic multi-step tool-calling with a visible execution trace	Demonstrates "Agentic AI Fundamentals" and "API & Function Integration" — not just theory
Streaming conversational UI	Demonstrates "Conversational AI UX and Streaming Responses"
Rule-based personalization/variant delivery	Mirrors Adobe Target conceptually — shows you can reason about audience-driven content
A real (if lightweight) evaluation harness	Shows AI-engineering maturity — you don't just ship AI features, you measure them
Full REST API surface, sensibly versioned and documented	Directly matches "web services development using RESTful implementations"
4. Key Features
Content Service — create, edit, version, and publish structured content items (blog post, landing page, product page).
Author Studio — internal admin UI for editors to write/edit content and see version history.
Public Delivery Site — a real rendered front-end that serves published content (Next.js SSR/ISR).
Auto-embedding pipeline — on publish, content is chunked and embedded automatically; no manual step.
Semantic search — "find content about X" returns ranked, relevant chunks, not just keyword matches.
RAG-grounded chat assistant — a streaming chat widget that answers questions using only your own published content as context (with citations back to source content).
Agentic "Prep for Publish" flow — one click triggers a multi-step agent run: generate meta description → check SEO basics → suggest an audience segment → return a structured checklist for human approval.
Segment-based personalization — define audience segments (e.g., new vs returning visitor) and content variants; the delivery layer resolves the right variant per visitor.
Agent execution trace/log — every agent run is stored and viewable, so you can explain what the AI did and why (critical for the interview, and for trust in a real system).
Evaluation harness — retrieval precision@k on a hand-labeled query set, agent completion-rate, and streaming latency, all trackable over time.
Full documented REST API (see §8).
Dockerized, one-command local setup.
5. System Architecture
External Services

Data Layer

Backend API (Node.js + Express, TypeScript)

Client Layer

REST

REST

SSE stream

on publish

agent tool calls

agent tool calls

Author Studio
(Next.js/TS - internal)

Public Delivery Site
(Next.js SSR/ISR)

Chat Widget
(streaming, SSE)

Content Service

Embedding / Indexing Service

AI Orchestration Service
(RAG + Agent + Streaming)

Personalization Engine

Evaluation Service

PostgreSQL
content, versions, segments, variants

pgvector
content_embeddings

Redis
(session/rate-limit cache)

LLM Provider
(Anthropic / OpenAI API)

Embedding Model API

Component responsibilities:

Content Service — the CRUD + workflow core. Owns content items, versions, and the draft→published state machine.
Embedding/Indexing Service — triggered on publish; chunks content, calls the embedding API, writes vectors to pgvector. Decoupled from the request path so publishing never blocks on embedding.
AI Orchestration Service — the brain. Handles three jobs: (a) semantic search, (b) RAG-grounded streaming chat, (c) agentic multi-step tool execution. All three share the same retrieval layer.
Personalization Engine — resolves which content variant to serve a given visitor, based on segment rules. Cheap, fast, rule-based — deliberately not ML-heavy, so it's explainable (and buildable in the time you have).
Evaluation Service — runs scheduled/on-demand scoring jobs against retrieval and agent logs.
6. Data Model
Table	Key columns	Purpose
users	id, name, email, role	Author/admin identity
content_items	id, type, title, slug, status, created_by, timestamps	Core content record
content_versions	id, content_item_id, version_no, body_json, meta_json	Full version history
content_embeddings	id, content_item_id, chunk_index, chunk_text, embedding vector(1536)	RAG index
segments	id, name, rule_json	Audience segment definitions
content_variants	id, content_item_id, segment_id, variant_body_json	Personalized content per segment
agent_action_logs	id, task, steps_json, result_json, created_at	Full trace of every agent run
eval_results	id, eval_type, target_id, score, details_json, created_at	Evaluation history
impressions	id, content_item_id, segment_id, variant_id, timestamp	Delivery logging, feeds evaluation
7. End-to-End Flows
Flow A — Publish & Auto-Index

Editor writes/edits a draft in Author Studio → PUT /api/content/:id.
Editor clicks Publish → POST /api/content/:id/publish.
Content Service marks the item published, fires an async job to the Embedding Service.
Embedding Service chunks the body text, calls the embedding API, writes rows to content_embeddings.
Content is now discoverable by search and the chat assistant — no manual re-index step, ever.
Flow B — RAG-Grounded Chat (the core AI flow)

LLM Provider
pgvector
AI Orchestration Service
Editor (Chat Widget)
LLM Provider
pgvector
AI Orchestration Service
Editor (Chat Widget)
UI renders answer incrementally,
with citations back to source content
POST /api/assistant/chat (question, stream=true)
embed(question)
similarity search (top-k)
relevant content chunks
prompt = question + retrieved chunks
streamed tokens
SSE stream, token by token
Flow C — Agentic "Prep for Publish"

Editor clicks Prep for Publish on a draft → POST /api/assistant/agent/execute with task: "prepare_publish".
Agent orchestrator plans a short step sequence and executes tool calls in order:
generate_meta_description(contentId)
check_seo_score(contentId)
suggest_audience_segment(contentId)
Each tool call and its result is appended to the run's trace (agent_action_logs).
Orchestrator returns a structured checklist to the UI; the editor reviews and approves before publishing (human-in-the-loop by design — never auto-publishes).
Flow D — Personalized Delivery

Visitor loads a page on the Public Delivery Site.
Site calls GET /api/personalize/deliver?contentId=&sessionId=.
Personalization Engine evaluates segment rules (e.g., new vs returning, referrer source) against the visitor.
Correct content_variant is returned and rendered; an impression row is logged.
Evaluation Service later aggregates impressions to report whether segment-matched variants are actually being served correctly.
8. API Specification
Content Service

Method	Endpoint	Purpose
POST	/api/content	Create a new draft content item
GET	/api/content	List content (filter by type/status)
GET	/api/content/:id	Get one item + latest version
PUT	/api/content/:id	Update a draft
POST	/api/content/:id/publish	Publish (triggers embedding pipeline)
GET	/api/content/:id/versions	Version history
DELETE	/api/content/:id	Soft delete
AI Assistant / RAG

Method	Endpoint	Purpose
POST	/api/assistant/search	Semantic search over published content
POST	/api/assistant/chat	RAG-grounded streaming chat (SSE)
POST	/api/assistant/agent/execute	Run a multi-step agentic task
GET	/api/assistant/agent/logs/:id	Retrieve one agent run's full trace
Personalization

Method	Endpoint	Purpose
POST	/api/personalize/segments	Create/update a segment rule
GET	/api/personalize/segments	List segments
POST	/api/personalize/variants	Create a content variant for a segment
GET	/api/personalize/deliver	Resolve which variant to serve a visitor
Evaluation

Method	Endpoint	Purpose
POST	/api/eval/run	Trigger an evaluation batch
GET	/api/eval/results	Fetch evaluation history
Auth (kept light — JWT)

Method	Endpoint	Purpose
POST	/api/auth/login	Editor/admin login
9. Tech Stack
Frontend: Next.js, TypeScript, Tailwind CSS — Author Studio, public delivery site, and chat widget (SSE consumer)
Backend: Node.js, Express, TypeScript
Database: PostgreSQL + pgvector extension
LLM & Embeddings: Anthropic or OpenAI API (chat completion with streaming + embeddings endpoint)
Cache/session: Redis (optional, for streaming session state and rate limiting)
Testing: Jest, React Testing Library
DevOps: Docker + docker-compose, GitHub Actions CI
This stack is a near-exact match to what's already on your resume — you're not learning a new ecosystem, you're applying your existing one (React, Next.js, TypeScript, Node.js, Express, PostgreSQL) to a new, higher-signal problem.

10. Evaluation & Metrics
Retrieval quality: precision@k / recall@k against a small hand-labeled set of ~20 test queries with known correct source content.
Agent reliability: % of agent runs that complete all planned steps without error, tracked in agent_action_logs.
Personalization correctness: % of impressions where the served variant matched the visitor's resolved segment.
Latency: time-to-first-token for the streaming chat endpoint.
Having any of these numbers to quote in an interview ("my retrieval hit 85% precision@5 on my test set") is a strong differentiator over "I used RAG."

11. Suggested Build Plan (3 weeks)
Week	Focus
1	Data model + Content Service (full CRUD + versioning) + Author Studio UI + Public Delivery Site rendering published content
2	Embedding pipeline on publish + semantic search endpoint + streaming RAG chat endpoint + chat widget UI
3	Agentic "Prep for Publish" flow + Personalization Engine + Evaluation harness + Docker packaging + README + short demo video/GIF
If time is short, Week 1 + Week 2 alone (CMS + working RAG search/chat) is already a strong, demo-able project — Week 3 is what pushes it from "good" to "matches the JD line for line."

12. Mapping to the Adobe JD
JD requirement	ContentPilot AI feature
Content Management System experience	Full Content Service with versioning + publish workflow
Create and integrate content-driven applications	End-to-end: authoring → delivery → personalization
Web services development using RESTful implementations	Full documented REST API (§8)
GenAI Fundamentals and LLM Integration	Core to the AI Orchestration Service
RAG Fundamentals and Embeddings & Vector Search	Flow A + Flow B, pgvector index
Agentic AI Fundamentals	Flow C, tool-calling with a visible trace
API & Function Integration	Agent tool functions (generate_meta_description, etc.)
Conversational AI UX and Streaming Responses	Streaming chat widget (SSE)
Exposure to Node.js	Entire backend
Angular JS, UI, JavaScript, CSS / React, TypeScript	Author Studio + Public Delivery Site
Strong knowledge of databases and SQL	PostgreSQL schema, joins across content/versions/segments
AI Evaluation techniques	§10 Evaluation harness


