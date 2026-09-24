import { LLMProvider } from './types';
import { GroqProvider } from './groq.provider';
import { OllamaLLMProvider } from './ollama-llm.provider';
import { MockLLMProvider } from './mock-llm.provider';
import { env } from '../../config/env';

export * from './types';
export * from './groq.provider';
export * from './ollama-llm.provider';
export * from './mock-llm.provider';

export function createLLMProvider(): LLMProvider {
  if (process.env.NODE_ENV === 'test') {
    return new MockLLMProvider();
  }

  switch (env.LLM_PROVIDER) {
    case 'groq':
      return new GroqProvider({
        apiKey: env.GROQ_API_KEY,
        model: env.LLM_MODEL,
      });
    case 'ollama':
      return new OllamaLLMProvider({
        baseUrl: env.OLLAMA_URL,
        model: env.OLLAMA_LLM_MODEL,
      });
    default:
      return new GroqProvider({
        apiKey: env.GROQ_API_KEY,
        model: env.LLM_MODEL,
      });
  }
}
