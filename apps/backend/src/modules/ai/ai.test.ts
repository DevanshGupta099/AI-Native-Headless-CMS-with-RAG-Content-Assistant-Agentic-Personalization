import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIService } from './service';
import { textSplitter } from '../../services/chunking/text-splitter';
import { pgVectorStore } from '../../services/vector/pgvector.store';

vi.mock('../../services/vector/pgvector.store', () => ({
  pgVectorStore: {
    similaritySearch: vi.fn(),
  },
}));

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    vi.clearAllMocks();
    aiService = new AIService();
  });

  describe('search', () => {
    it('should return ranked vector search chunks', async () => {
      const mockResults = [
        {
          id: 'chunk-1',
          contentItemId: 'item-1',
          title: 'Post Title',
          slug: 'post-title',
          type: 'BLOG_POST',
          chunkIndex: 0,
          chunkText: 'Sample content chunk text',
          similarity: 0.88,
        },
      ];

      vi.mocked(pgVectorStore.similaritySearch).mockResolvedValue(mockResults);

      const results = await aiService.search('how to optimize SEO', 5, 0.5);

      expect(results).toHaveLength(1);
      expect(results[0]?.title).toBe('Post Title');
      expect(results[0]?.similarity).toBe(0.88);
      expect(pgVectorStore.similaritySearch).toHaveBeenCalled();
    });
  });

  describe('streamRAGChat', () => {
    it('should yield sources event followed by tokens and done event', async () => {
      vi.mocked(pgVectorStore.similaritySearch).mockResolvedValue([
        {
          id: 'chunk-1',
          contentItemId: 'item-1',
          title: 'RAG Guide',
          slug: 'rag-guide',
          type: 'BLOG_POST',
          chunkIndex: 0,
          chunkText: 'RAG stands for retrieval augmented generation.',
          similarity: 0.92,
        },
      ]);

      const events = [];
      for await (const event of aiService.streamRAGChat('What is RAG?')) {
        events.push(event);
      }

      expect(events.length).toBeGreaterThanOrEqual(3);
      expect(events[0]?.event).toBe('sources');
      expect(events[events.length - 1]?.event).toBe('done');

      const tokenEvents = events.filter((e) => e.event === 'token');
      expect(tokenEvents.length).toBeGreaterThan(0);
    });
  });
});

describe('RecursiveTextSplitter', () => {
  it('should return a single chunk for short text', () => {
    const text = 'This is a short sentence that does not exceed maxChunkSize.';
    const chunks = textSplitter.splitText(text);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.chunkText).toBe(text);
  });

  it('should split multi-paragraph text across paragraphs', () => {
    const para1 = 'Paragraph 1: ' + 'A'.repeat(500);
    const para2 = 'Paragraph 2: ' + 'B'.repeat(500);
    const para3 = 'Paragraph 3: ' + 'C'.repeat(500);
    const fullText = `${para1}\n\n${para2}\n\n${para3}`;

    const chunks = textSplitter.splitText(fullText);

    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks[0]?.chunkIndex).toBe(0);
  });
});
