export interface ChunkingOptions {
  maxChunkSize?: number; // characters, default: 2000 (~500 tokens)
  overlapSize?: number;  // characters, default: 200 (~50 tokens)
  minChunkSize?: number; // characters, default: 100
}

export interface ContentChunk {
  chunkIndex: number;
  chunkText: string;
}

export class RecursiveTextSplitter {
  private maxChunkSize: number;
  private overlapSize: number;
  private minChunkSize: number;

  constructor(options?: ChunkingOptions) {
    this.maxChunkSize = options?.maxChunkSize ?? 2000;
    this.overlapSize = options?.overlapSize ?? 200;
    this.minChunkSize = options?.minChunkSize ?? 100;
  }

  splitText(text: string): ContentChunk[] {
    const rawText = text.trim();
    if (!rawText) return [];

    if (rawText.length <= this.maxChunkSize) {
      return [{ chunkIndex: 0, chunkText: rawText }];
    }

    // Step 1: Split into paragraphs
    const paragraphs = rawText.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      const trimmedPara = paragraph.trim();
      if (!trimmedPara) continue;

      if ((currentChunk + '\n\n' + trimmedPara).length <= this.maxChunkSize) {
        currentChunk = currentChunk ? `${currentChunk}\n\n${trimmedPara}` : trimmedPara;
      } else {
        if (currentChunk.length >= this.minChunkSize) {
          chunks.push(currentChunk);
        }

        // If the paragraph itself exceeds maxChunkSize, split by sentence
        if (trimmedPara.length > this.maxChunkSize) {
          const sentences = trimmedPara.split(/(?<=[.?!])\s+/);
          let sentenceChunk = '';

          for (const sentence of sentences) {
            if ((sentenceChunk + ' ' + sentence).length <= this.maxChunkSize) {
              sentenceChunk = sentenceChunk ? `${sentenceChunk} ${sentence}` : sentence;
            } else {
              if (sentenceChunk.length >= this.minChunkSize) {
                chunks.push(sentenceChunk);
              }
              sentenceChunk = sentence;
            }
          }
          if (sentenceChunk.length >= this.minChunkSize) {
            chunks.push(sentenceChunk);
          }
          currentChunk = '';
        } else {
          // Add overlap from end of previous chunk if available
          const overlap = currentChunk ? currentChunk.slice(-this.overlapSize) : '';
          currentChunk = overlap ? `${overlap}\n\n${trimmedPara}` : trimmedPara;
        }
      }
    }

    if (currentChunk.length >= this.minChunkSize) {
      chunks.push(currentChunk);
    }

    return chunks.map((chunkText, chunkIndex) => ({
      chunkIndex,
      chunkText,
    }));
  }
}

export const textSplitter = new RecursiveTextSplitter();
