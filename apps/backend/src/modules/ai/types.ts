import {
  SearchQueryInput,
  ChatRequestInput,
  SearchResultChunk,
  RAGCitation,
  ChatMessage,
} from '@contentpilot/shared';

export type { SearchQueryInput, ChatRequestInput, SearchResultChunk, RAGCitation, ChatMessage };

export interface SSEEvent {
  event: 'sources' | 'token' | 'done' | 'error';
  data: unknown;
}
