import { createEmbeddingProvider } from '../../services/embedding';
import { createLLMProvider } from '../../services/llm';
import { pgVectorStore } from '../../services/vector/pgvector.store';
import {
  SearchResultChunk,
  RAGCitation,
  ChatMessage,
  SSEEvent,
} from './types';

export class AIService {
  private embeddingProvider = createEmbeddingProvider();
  private llmProvider = createLLMProvider();

  async search(
    query: string,
    topK = 5,
    minSimilarity = 0.5
  ): Promise<SearchResultChunk[]> {
    const queryEmbedding = await this.embeddingProvider.embed(query);
    return pgVectorStore.similaritySearch(queryEmbedding, {
      topK,
      minSimilarity,
    });
  }

  async *streamRAGChat(
    question: string,
    history: ChatMessage[] = []
  ): AsyncGenerator<SSEEvent> {
    // Step 1: Embed question
    const queryEmbedding = await this.embeddingProvider.embed(question);

    // Step 2: Retrieve top-k context chunks
    const chunks = await pgVectorStore.similaritySearch(queryEmbedding, {
      topK: 5,
      minSimilarity: 0.35,
    });

    // Step 3: Yield citation sources to client
    const citations: RAGCitation[] = chunks.map((c) => ({
      contentId: c.contentItemId,
      title: c.title,
      slug: c.slug,
      chunkText: c.chunkText,
      similarity: c.similarity,
    }));

    yield {
      event: 'sources',
      data: citations,
    };

    // Step 4: Construct grounded system prompt
    const contextBlock = chunks.length
      ? chunks.map((c) => `[Source: ${c.title}]\n${c.chunkText}`).join('\n\n')
      : 'No relevant CMS content chunks found for this query.';

    const systemPrompt = `You are ContentPilot AI, a knowledgeable content assistant for an enterprise headless CMS.
Answer the user's question using ONLY the published content context provided below.
If the context does not contain enough information to answer, politely state that you can only answer questions based on the published CMS content.
Cite sources using the format [Source: {Title}].

--- CONTEXT ---
${contextBlock}
--- END CONTEXT ---`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: question },
    ];

    // Step 5: Stream answer tokens via LLM
    try {
      for await (const token of this.llmProvider.chat(messages, { temperature: 0.3 })) {
        yield {
          event: 'token',
          data: { token },
        };
      }
    } catch (err: unknown) {
      yield {
        event: 'error',
        data: { message: (err as Error).message || 'LLM generation failed' },
      };
      return;
    }

    yield {
      event: 'done',
      data: {},
    };
  }
}

export const aiService = new AIService();
