import { EmbeddingProvider } from './types';
import { AppError } from '../../utils/AppError';
import { EMBEDDING_DIMENSION } from '@contentpilot/shared';

export class HuggingFaceEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'huggingface';
  readonly dimensions = EMBEDDING_DIMENSION; // 384
  private apiKey: string;
  private model: string;

  constructor(config: { apiKey: string; model: string }) {
    this.apiKey = config.apiKey;
    this.model = config.model;
  }

  private getEndpoint(): string {
    return `https://api-inference.huggingface.co/pipeline/feature-extraction/${this.model}`;
  }

  async embed(text: string): Promise<number[]> {
    const results = await this.embedBatch([text]);
    const first = results[0];
    if (!first) {
      throw new AppError('Failed to generate embedding', 500, 'EMBEDDING_ERROR');
    }
    return first;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!texts.length) return [];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: texts,
        options: { wait_for_model: true },
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: string };
      const msg = err?.error || `HuggingFace API returned ${response.status}`;
      throw new AppError(`Embedding API Error: ${msg}`, response.status, 'EMBEDDING_ERROR');
    }

    const data = (await response.json()) as number[][] | number[];

    // If single array returned when single text sent
    if (typeof data[0] === 'number') {
      return [data as number[]];
    }

    return data as number[][];
  }
}
