'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Send,
  Bot,
  User,
  FileText,
  AlertCircle,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';

interface SearchResultItem {
  id: string;
  contentItemId: string;
  chunkIndex: number;
  chunkText: string;
  title: string;
  slug: string;
  similarity: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { contentId: string; title: string; similarity: number }[];
}

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'search'>('chat');

  // Streaming chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    if (!question.trim() || isStreaming) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = { id: userMsgId, role: 'user', content: question };

    const assistantMsgId = `asst-${Date.now() + 1}`;
    const assistantMsg: ChatMessage = { id: assistantMsgId, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputQuestion('');
    setIsStreaming(true);
    setChatError(null);

    try {
      const response = await fetch('http://localhost:3001/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Chat API failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No readable stream returned');

      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawData = line.slice(6).trim();
            if (rawData === '[DONE]') continue;

            try {
              const parsed = JSON.parse(rawData);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulatedText } : m))
                );
              }
              if (parsed.sources) {
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, sources: parsed.sources } : m))
                );
              }
            } catch {
              // Ignore partial JSON lines
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setChatError(err.message);
      } else {
        setChatError('Failed to communicate with RAG assistant');
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputQuestion);
  };

  const clearMessages = () => {
    setMessages([]);
    setChatError(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await api.get<{ data: SearchResultItem[] }>('/api/assistant/search', {
        q: searchQuery,
        limit: 8,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#eb1000]/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#ff4d6d] border border-[#eb1000]/30">
              ADOBE SENSEI GENAI
            </span>
            <span className="text-xs text-slate-500 font-mono">RAG RETRIEVAL ENGINE</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            RAG Copilot & Vector Laboratory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Ground-truth conversational assistant powered by pgvector 384-dim embeddings & Groq Llama-3.3-70B.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl specular-card p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'chat'
                ? 'btn-adobe-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Streaming Copilot</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'search'
                ? 'btn-adobe-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Vector Search Lab</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Streaming RAG Chat */}
      {activeTab === 'chat' && (
        <div className="specular-card rounded-2xl flex flex-col h-[650px] overflow-hidden border border-white/[0.08]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-12 w-12 rounded-2xl bg-[#eb1000]/10 border border-[#eb1000]/30 text-[#ff4d6d] flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  ContentPilot RAG Knowledge Assistant
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
                  Answers are strictly grounded in your published AEM content with verified source citations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full text-left text-xs">
                  <button
                    onClick={() => sendMessage('What content articles do we currently have published in the CMS?')}
                    className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#eb1000]/40 transition text-slate-300 group"
                  >
                    <p className="font-semibold text-white group-hover:text-cyan-300 transition">
                      "What content do we have published?"
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Queries pgvector index for all published articles</p>
                  </button>
                  <button
                    onClick={() => sendMessage('How do we configure audience segments for personalization?')}
                    className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#eb1000]/40 transition text-slate-300 group"
                  >
                    <p className="font-semibold text-white group-hover:text-cyan-300 transition">
                      "How does personalization work?"
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">Retrieves Adobe Target rule evaluation docs</p>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-500">
                    {msg.role === 'user' ? (
                      <>
                        <span>Author Studio</span>
                        <User className="h-3 w-3 text-slate-400" />
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3 text-[#ff4d6d]" />
                        <span>Sensei AI • Grounded Response</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-2xl rounded-2xl px-5 py-3.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#eb1000] to-[#fa383e] text-white rounded-br-none shadow-md shadow-[#eb1000]/20'
                        : 'specular-card text-slate-200 rounded-bl-none border border-white/10'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content || (isStreaming ? 'Synthesizing response from pgvector context...' : '')}</p>
                  </div>

                  {/* Source Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 self-center">
                        Verified Sources:
                      </span>
                      {msg.sources.map((s, idx) => (
                        <Link
                          key={idx}
                          href={`/content/${s.contentId}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition"
                          title={`Cosine Similarity: ${Math.round(s.similarity * 100)}%`}
                        >
                          <FileText className="h-3 w-3 text-cyan-400" />
                          <span>{s.title}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">
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
              <div className="rounded-xl bg-rose-500/10 p-3.5 text-xs text-rose-400 border border-rose-500/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{chatError}</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="border-t border-white/[0.08] p-4 bg-black/40">
            <form onSubmit={handleSendChat} className="flex gap-2.5">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask anything about your published CMS content..."
                disabled={isStreaming}
                className="flex-1 rounded-xl border border-white/10 bg-[#0c0e14] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#eb1000] focus:ring-1 focus:ring-[#eb1000]/40 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={isStreaming || !inputQuestion.trim()}
                className="btn-adobe-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isStreaming ? 'Streaming...' : 'Ask Copilot'}</span>
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  title="Clear conversation"
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-400 hover:bg-white/[0.05] hover:text-white transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Semantic Vector Search */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="specular-card p-6 rounded-2xl space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
              Natural Language Semantic Vector Query
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., How does personalized delivery evaluate audience rules?"
                className="flex-1 rounded-xl border border-white/10 bg-[#0c0e14] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#eb1000] focus:ring-1 focus:ring-[#eb1000]/40 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="btn-adobe-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                <span>{isSearching ? 'Embedding & Querying...' : 'Cosine Search'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Transforms query into 384-dim dense embedding and calculates vector distance via{' '}
              <code className="text-cyan-400">&lt;=&gt;</code> cosine distance operator in pgvector.
            </p>
          </form>

          {searchError && (
            <div className="rounded-xl bg-rose-500/10 p-4 text-xs font-medium text-rose-400 border border-rose-500/20">
              {searchError}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Ranked Vector Chunks ({searchResults.length} matches)
                </h2>
                <span className="text-[11px] font-mono text-emerald-400">
                  Cosine Similarity Filter: &gt;= 0.35
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="specular-card specular-card-hover p-5 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/content/${chunk.contentItemId}`}
                          className="font-bold text-white hover:text-cyan-300 transition text-sm"
                        >
                          {chunk.title}
                        </Link>
                        <span className="text-[11px] font-mono text-slate-500">/{chunk.slug}</span>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-400">
                        {Math.round(chunk.similarity * 100)}% match
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300 font-mono bg-black/40 p-3.5 rounded-xl border border-white/[0.04]">
                      {chunk.chunkText}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Chunk Sequence #{chunk.chunkIndex}</span>
                      <Link
                        href={`/content/${chunk.contentItemId}`}
                        className="text-[#ff4d6d] hover:text-cyan-300 flex items-center gap-1 font-semibold transition"
                      >
                        <span>Open Document in Editor</span>
                        <ArrowRight className="h-3 w-3" />
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
