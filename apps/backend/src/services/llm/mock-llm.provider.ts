import { LLMProvider, ChatMessage, StreamOptions } from './types';

export class MockLLMProvider implements LLMProvider {
  readonly name = 'mock';
  private defaultResponse: string;

  constructor(defaultResponse = 'This is a mocked LLM response from ContentPilot AI.') {
    this.defaultResponse = defaultResponse;
  }

  async *chat(_messages: ChatMessage[], _options?: StreamOptions): AsyncGenerator<string> {
    const words = this.defaultResponse.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield (i === 0 ? '' : ' ') + words[i];
    }
  }

  async chatSync(_messages: ChatMessage[], _options?: StreamOptions): Promise<string> {
    return this.defaultResponse;
  }
}
