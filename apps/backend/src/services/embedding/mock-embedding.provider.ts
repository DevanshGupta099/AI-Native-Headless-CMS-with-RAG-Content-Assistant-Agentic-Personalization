import { EmbeddingProvider } from './types';
import { EMBEDDING_DIMENSION } from '@contentpilot/shared';

export class MockEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'mock';
  readonly dimensions = EMBEDDING_DIMENSION; // 384

  async embed(_text: string): Promise<number[]> {
    // Generate deterministic normalized vector of length 384
    const vector = new Array(this.dimensions).fill(0).map((_, i) => Math.sin(i) / Math.sqrt(this.dimensions));
    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}
