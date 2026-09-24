export const CONTENT_TYPES = ['BLOG_POST', 'LANDING_PAGE', 'PRODUCT_PAGE'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const USER_ROLES = ['ADMIN', 'EDITOR'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const EMBEDDING_DIMENSION = 384; // BAAI/bge-small-en-v1.5
export const CHUNK_SIZE_TOKENS = 500;
export const CHUNK_OVERLAP_TOKENS = 50;

export const GROQ_MODELS = {
  PRIMARY: 'llama-3.3-70b-versatile',
  FALLBACK: 'mixtral-8x7b-32768',
} as const;

export const HUGGINGFACE_MODELS = {
  EMBEDDINGS: 'BAAI/bge-small-en-v1.5',
} as const;

export const OLLAMA_MODELS = {
  LLM: 'llama3.2:3b',
  EMBEDDINGS: 'nomic-embed-text',
} as const;

export const EVAL_TYPES = [
  'retrieval_precision',
  'agent_reliability',
  'personalization_correctness',
] as const;
export type EvalType = (typeof EVAL_TYPES)[number];
