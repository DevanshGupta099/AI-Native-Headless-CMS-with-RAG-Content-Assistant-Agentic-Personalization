'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSSE } from '@/hooks/useSSE';
import { api } from '@/lib/api';
import { SearchResultChunk } from '@contentpilot/shared';

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'search'>('chat');
  const { messages, isStreaming, error: chatError, sendMessage, clearMessages } = useSSE();
  const [inputQuestion, setInputQuestion] = useState('');

  // Semantic search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    sendMessage(inputQuestion);
    setInputQuestion('');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await api.post<{ data: SearchResultChunk[] }>('/api/assistant/search', {
        query: searchQuery,
        topK: 5,
        minSimilarity: 0.35,
      });
      setSearchResults(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError('Search failed');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">AI Content Copilot</h1>
          <p className="text-sm text-slate-500">
            RAG-grounded assistant with source citations & pgvector semantic discovery.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('chat')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            💬 Streaming Chat Assistant
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            🔍 Semantic Vector Search
          </button>
        </div>
      </div>

      {/* Tab 1: Streaming RAG Chat */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-2xl mb-4">
                  🤖
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  How can ContentPilot assist you today?
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                  Answers are grounded strictly in your published CMS content with clickable source citations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full text-left text-xs">
                  <button
                    onClick={() => sendMessage('What content articles do we currently have published?')}
                    className="p-3 rounded-lg border border-slate-200 hover:border-indigo-500 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-slate-700 dark:text-slate-300"
                  >
                    "What content do we have published?"
                  </button>
                  <button
                    onClick={() => sendMessage('How do we configure audience segments for personalization?')}
                    className="p-3 rounded-lg border border-slate-200 hover:border-indigo-500 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-slate-700 dark:text-slate-300"
                  >
                    "How does personalization work?"
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content || (isStreaming ? 'Thinking...' : '')}</p>
                  </div>

                  {/* Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 self-center">
                        Sources:
                      </span>
                      {msg.sources.map((s, idx) => (
                        <Link
                          key={idx}
                          href={`/content/${s.contentId}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                          title={`Similarity: ${Math.round(s.similarity * 100)}%`}
                        >
                          <span>📄</span>
                          <span>{s.title}</span>
                          <span className="text-[10px] text-indigo-400 font-mono">
                            {Math.round(s.similarity * 100)}%
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {chatError && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                {chatError}
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <form onSubmit={handleSendChat} className="flex gap-2.5">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask anything about your published CMS content..."
                disabled={isStreaming}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={isStreaming || !inputQuestion.trim()}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {isStreaming ? 'Streaming...' : 'Send'}
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Semantic Vector Search */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Semantic Natural Language Query
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., How does personalized delivery evaluate audience rules?"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Vector Search'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Query is transformed into a 384-dim dense embedding and compared using cosine distance (<code className="text-indigo-600">&lt;=&gt;</code>) in pgvector.
            </p>
          </form>

          {searchError && (
            <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-200">
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Ranked Vector Chunks ({searchResults.length} matches)
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/content/${chunk.contentItemId}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 dark:text-white"
                        >
                          {chunk.title}
                        </Link>
                        <span className="text-xs text-slate-400">/{chunk.slug}</span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                        {Math.round(chunk.similarity * 100)}% match
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
                      {chunk.chunkText}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Chunk index #{chunk.chunkIndex}</span>
                      <Link
                        href={`/content/${chunk.contentItemId}`}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        Inspect in Editor →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
