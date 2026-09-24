import { EmbeddingProvider } from './types';
import { AppError } from '../../utils/AppError';
import { EMBEDDING_DIMENSION } from '@contentpilot/shared';

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'ollama';
  readonly dimensions = EMBEDDING_DIMENSION; // 384 default
  private baseUrl: string;
  private model: string;

  constructor(config: { baseUrl: string; model: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.model = config.model;
  }

  async embed(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new AppError(`Ollama embedding returned status ${response.status}`, response.status, 'EMBEDDING_ERROR');
      }

      const data = (await response.json()) as { embedding?: number[] };
      return data.embedding || [];
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError('Failed to connect to Ollama embedding service', 503, 'OLLAMA_UNAVAILABLE');
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const results: number[][] = [];
    for (const text of texts) {
      const vec = await this.embed(text);
      results.push(vec);
    }
    return results;
  }
}
