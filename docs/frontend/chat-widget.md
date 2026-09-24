# Chat Widget & SSE Streaming Protocol

## Streaming Hook (`useSSE`)

The streaming assistant uses a custom React hook that connects to `/api/assistant/chat` via `fetch` with `ReadableStream` reader support:

```typescript
export function useSSE() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sources, setSources] = useState<RAGCitation[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (question: string) => {
    setIsStreaming(true);
    // Reads chunks line-by-line, parses event: and data: payloads
  };

  return { messages, sources, isStreaming, sendMessage };
}
```

## Protocol Event Format

1. `event: sources`: Dispatches top-k retrieved citations before answer generation starts.
2. `event: token`: Emits individual generated tokens for smooth typing effect.
3. `event: done`: Closes the stream and commits the final message into chat state.
4. `event: error`: Reports rate-limiting or provider timeouts with recovery hints.
