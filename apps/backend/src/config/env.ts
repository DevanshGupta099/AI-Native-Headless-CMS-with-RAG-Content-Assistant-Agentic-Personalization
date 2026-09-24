import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load from root .env if present, otherwise default
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config(); // fallback to local cwd

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // AI Providers
  LLM_PROVIDER: z.enum(['groq', 'ollama']).default('groq'),
  EMBEDDING_PROVIDER: z.enum(['huggingface', 'ollama']).default('huggingface'),
  GROQ_API_KEY: z.string().optional().default(''),
  HUGGINGFACE_API_KEY: z.string().optional().default(''),
  LLM_MODEL: z.string().default('llama-3.3-70b-versatile'),
  EMBEDDING_MODEL: z.string().default('BAAI/bge-small-en-v1.5'),

  // Ollama local fallback
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),
  OLLAMA_LLM_MODEL: z.string().default('llama3.2:3b'),
  OLLAMA_EMBEDDING_MODEL: z.string().default('nomic-embed-text'),

  // Auth
  JWT_SECRET: z.string().min(16).default('dev-super-secret-jwt-key-min-16-chars'),
  JWT_EXPIRY: z.string().default('7d'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
