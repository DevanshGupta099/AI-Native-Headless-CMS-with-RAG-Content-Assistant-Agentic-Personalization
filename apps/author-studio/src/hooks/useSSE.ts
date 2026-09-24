'use client';

import { useState, useCallback } from 'react';
import { RAGCitation } from '@contentpilot/shared';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: RAGCitation[];
  timestamp: string;
}

export function useSSE() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isStreaming) return;

      const userMessage: ChatMessageItem = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        timestamp: new Date().toISOString(),
      };

      const assistantMessageId = `asst-${Date.now()}`;
      const initialAssistantMessage: ChatMessageItem = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        sources: [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
      setIsStreaming(true);
      setError(null);

      try {
        const token = localStorage.getItem('cp_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const history = messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch(`${apiUrl}/api/assistant/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            question,
            history,
            stream: true,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.error?.message || `Request failed with status ${response.status}`);
        }

        if (!response.body) {
          throw new Error('Response body is empty');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = 'message';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('event: ')) {
              currentEvent = trimmed.slice(7).trim();
            } else if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6);
              try {
                const data = JSON.parse(dataStr);

                if (currentEvent === 'sources') {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? { ...msg, sources: data as RAGCitation[] } : msg
                    )
                  );
                } else if (currentEvent === 'token') {
                  const tokenText = (data as { token: string }).token;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? { ...msg, content: msg.content + tokenText } : msg
                    )
                  );
                } else if (currentEvent === 'error') {
                  setError((data as { message: string }).message);
                }
              } catch {
                // Ignore parse errors on raw tokens
              }
            }
          }
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Streaming chat failed';
        setError(errorMsg);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: '⚠️ Failed to complete response. Please verify AI provider settings.' }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages]
  );

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
  };
}
