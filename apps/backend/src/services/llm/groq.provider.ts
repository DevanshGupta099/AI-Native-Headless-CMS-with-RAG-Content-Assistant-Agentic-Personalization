import { LLMProvider, ChatMessage, StreamOptions } from './types';
import { AppError } from '../../utils/AppError';

export class GroqProvider implements LLMProvider {
  readonly name = 'groq';
  private apiKey: string;
  private model: string;
  private endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(config: { apiKey: string; model: string }) {
    this.apiKey = config.apiKey;
    this.model = config.model;
  }

  async *chat(messages: ChatMessage[], options?: StreamOptions): AsyncGenerator<string> {
    if (!this.apiKey) {
      throw new AppError('GROQ_API_KEY is not configured', 500, 'AI_PROVIDER_ERROR');
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
        top_p: options?.topP ?? 1.0,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
      const msg = err?.error?.message || `Groq API responded with status ${response.status}`;
      if (response.status === 429) {
        throw new AppError('Groq rate limit exceeded (30 RPM). Please retry shortly.', 429, 'RATE_LIMITED');
      }
      throw new AppError(`Groq API Error: ${msg}`, response.status, 'AI_PROVIDER_ERROR');
    }

    if (!response.body) {
      throw new AppError('Response body from Groq is empty', 500, 'AI_PROVIDER_ERROR');
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
          // ignore malformed chunks
        }
      }
    }
  }

  async chatSync(messages: ChatMessage[], options?: StreamOptions): Promise<string> {
    if (!this.apiKey) {
      throw new AppError('GROQ_API_KEY is not configured', 500, 'AI_PROVIDER_ERROR');
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
        top_p: options?.topP ?? 1.0,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
      const msg = err?.error?.message || `Groq API responded with status ${response.status}`;
      if (response.status === 429) {
        throw new AppError('Groq rate limit exceeded (30 RPM). Please retry shortly.', 429, 'RATE_LIMITED');
      }
      throw new AppError(`Groq API Error: ${msg}`, response.status, 'AI_PROVIDER_ERROR');
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || '';
  }
}
