import { prisma } from '../../config/database';
import { SearchResultChunk } from '@contentpilot/shared';

export interface VectorSearchOptions {
  topK?: number;
  minSimilarity?: number;
}

export class PgVectorStore {
  async indexContentChunks(
    contentItemId: string,
    chunks: { chunkIndex: number; chunkText: string }[],
    embeddings: number[][]
  ): Promise<void> {
    if (!chunks.length || !embeddings.length) return;

    // Delete existing embeddings for this content item to maintain freshness
    await prisma.$executeRawUnsafe(
      `DELETE FROM content_embeddings WHERE content_item_id = $1`,
      contentItemId
    );

    // Insert new chunk vectors
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = embeddings[i];
      if (!chunk || !embedding) continue;

      const vectorString = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO content_embeddings (id, content_item_id, chunk_index, chunk_text, embedding, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4::vector, NOW())`,
        contentItemId,
        chunk.chunkIndex,
        chunk.chunkText,
        vectorString
      );
    }
  }

  async similaritySearch(
    queryEmbedding: number[],
    options?: VectorSearchOptions
  ): Promise<SearchResultChunk[]> {
    const topK = options?.topK ?? 5;
    const minSimilarity = options?.minSimilarity ?? 0.5;
    const vectorString = `[${queryEmbedding.join(',')}]`;

    const rawResults = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        contentItemId: string;
        title: string;
        slug: string;
        type: string;
        chunkIndex: number;
        chunkText: string;
        similarity: number;
      }>
    >(
      `SELECT 
         ce.id,
         ce.content_item_id AS "contentItemId",
         ci.title,
         ci.slug,
         ci.type::text AS "type",
         ce.chunk_index AS "chunkIndex",
         ce.chunk_text AS "chunkText",
         1 - (ce.embedding <=> $1::vector) AS similarity
       FROM content_embeddings ce
       JOIN content_items ci ON ci.id = ce.content_item_id
       WHERE ci.status = 'PUBLISHED'
       ORDER BY ce.embedding <=> $1::vector ASC
       LIMIT $2`,
      vectorString,
      topK
    );

    return rawResults
      .map((r) => ({
        id: r.id,
        contentItemId: r.contentItemId,
        title: r.title,
        slug: r.slug,
        type: r.type,
        chunkIndex: r.chunkIndex,
        chunkText: r.chunkText,
        similarity: Number(r.similarity),
      }))
      .filter((r) => r.similarity >= minSimilarity);
  }
}

export const pgVectorStore = new PgVectorStore();
