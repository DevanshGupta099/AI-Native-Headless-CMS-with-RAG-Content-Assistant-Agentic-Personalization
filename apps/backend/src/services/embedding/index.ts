import { EmbeddingProvider } from './types';
import { HuggingFaceEmbeddingProvider } from './huggingface.provider';
import { OllamaEmbeddingProvider } from './ollama-embedding.provider';
import { MockEmbeddingProvider } from './mock-embedding.provider';
import { env } from '../../config/env';

export * from './types';
export * from './huggingface.provider';
export * from './ollama-embedding.provider';
export * from './mock-embedding.provider';

export function createEmbeddingProvider(): EmbeddingProvider {
  if (process.env.NODE_ENV === 'test') {
    return new MockEmbeddingProvider();
  }

  switch (env.EMBEDDING_PROVIDER) {
    case 'huggingface':
      return new HuggingFaceEmbeddingProvider({
        apiKey: env.HUGGINGFACE_API_KEY,
        model: env.EMBEDDING_MODEL,
      });
    case 'ollama':
      return new OllamaEmbeddingProvider({
        baseUrl: env.OLLAMA_URL,
        model: env.OLLAMA_EMBEDDING_MODEL,
      });
    default:
      return new HuggingFaceEmbeddingProvider({
        apiKey: env.HUGGINGFACE_API_KEY,
        model: env.EMBEDDING_MODEL,
      });
  }
}
