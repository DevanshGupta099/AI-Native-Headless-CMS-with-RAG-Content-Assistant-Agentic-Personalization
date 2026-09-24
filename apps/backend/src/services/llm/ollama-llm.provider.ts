import { LLMProvider, ChatMessage, StreamOptions } from './types';
import { AppError } from '../../utils/AppError';

export class OllamaLLMProvider implements LLMProvider {
  readonly name = 'ollama';
  private baseUrl: string;
  private model: string;

  constructor(config: { baseUrl: string; model: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.model = config.model;
  }

  async *chat(messages: ChatMessage[], options?: StreamOptions): AsyncGenerator<string> {
    const endpoint = `${this.baseUrl}/v1/chat/completions`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new AppError(`Ollama responded with status ${response.status}`, response.status, 'AI_PROVIDER_ERROR');
      }

      if (!response.body) {
        throw new AppError('Empty response from Ollama', 500, 'AI_PROVIDER_ERROR');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') return;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              yield delta;
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        `Failed to connect to Ollama at ${this.baseUrl}. Ensure Ollama is running.`,
        503,
        'OLLAMA_UNAVAILABLE'
      );
    }
  }

  async chatSync(messages: ChatMessage[], options?: StreamOptions): Promise<string> {
    const endpoint = `${this.baseUrl}/v1/chat/completions`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new AppError(`Ollama responded with status ${response.status}`, response.status, 'AI_PROVIDER_ERROR');
      }

      const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      return data.choices?.[0]?.message?.content || '';
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        `Failed to connect to Ollama at ${this.baseUrl}. Ensure Ollama is running.`,
        503,
        'OLLAMA_UNAVAILABLE'
      );
    }
  }
}
