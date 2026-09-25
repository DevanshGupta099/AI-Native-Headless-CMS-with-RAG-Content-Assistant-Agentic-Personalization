import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { prisma } from '../config/database';
import { textSplitter } from '../services/chunking/text-splitter';
import { createEmbeddingProvider } from '../services/embedding';
import { pgVectorStore } from '../services/vector/pgvector.store';

export interface EmbedJobData {
  contentItemId: string;
}

const QUEUE_NAME = 'embedding-pipeline';

// Queue instance
export const embeddingQueue = new Queue<EmbedJobData>(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
  },
});

export async function processEmbeddingJob(contentItemId: string): Promise<void> {
  console.log(`⏳ Starting auto-embedding pipeline for content: ${contentItemId}`);

  const item = await prisma.contentItem.findUnique({
    where: { id: contentItemId },
    include: {
      versions: {
        orderBy: { versionNo: 'desc' },
        take: 1,
      },
    },
  });

  if (!item || item.status !== 'PUBLISHED') {
    console.warn(`⚠️ Content item ${contentItemId} is not in PUBLISHED status. Skipping vector indexing.`);
    return;
  }

  const latestVersion = item.versions[0];
  if (!latestVersion) {
    console.warn(`⚠️ No version content found for item ${contentItemId}. Skipping.`);
    return;
  }

  // Extract text representation from bodyJson
  let text = '';
  const body = latestVersion.bodyJson;
  if (typeof body === 'object' && body !== null) {
    if ('text' in body && typeof body.text === 'string') {
      text = body.text;
    } else {
      text = JSON.stringify(body);
    }
  }

  if (!text.trim()) {
    console.warn(`⚠️ Content body for item ${contentItemId} is empty. Skipping.`);
    return;
  }

  // 1. Chunk content
  const chunks = textSplitter.splitText(`${item.title}\n\n${text}`);
  console.log(`🧩 Generated ${chunks.length} chunks for: "${item.title}"`);

  // 2. Embed chunks
  const embeddingProvider = createEmbeddingProvider();
  const chunkTexts = chunks.map((c) => c.chunkText);
  const embeddings = await embeddingProvider.embedBatch(chunkTexts);

  // 3. Store in pgvector
  await pgVectorStore.indexContentChunks(contentItemId, chunks, embeddings);

  console.log(`✅ Successfully indexed ${chunks.length} vector embeddings for: "${item.title}"`);
}

// BullMQ Worker
export const embeddingWorker = new Worker<EmbedJobData>(
  QUEUE_NAME,
  async (job: Job<EmbedJobData>) => {
    await processEmbeddingJob(job.data.contentItemId);
  },
  {
    connection: redis,
    concurrency: 3,
  }
);

embeddingQueue.on('error', () => {
  // Gracefully handle queue disconnection
});

embeddingWorker.on('error', () => {
  // Gracefully handle worker disconnection
});

embeddingWorker.on('completed', (job) => {
  console.log(`🎉 Embedding job ${job.id} completed for content: ${job.data.contentItemId}`);
});

embeddingWorker.on('failed', (job, err) => {
  console.error(`❌ Embedding job ${job?.id} failed:`, err.message);
});

/**
 * Dispatch embedding job to queue, with graceful fallback to immediate processing
 * if Redis is not connected.
 */
export async function triggerEmbeddingPipeline(contentItemId: string): Promise<void> {
  try {
    await embeddingQueue.add('embed-content', { contentItemId });
  } catch (err: unknown) {
    console.warn('⚠️ Redis queue unavailable. Falling back to direct in-process indexing:', (err as Error).message);
    // Process asynchronously in background
    setImmediate(async () => {
      try {
        await processEmbeddingJob(contentItemId);
      } catch (innerErr) {
        console.error('❌ Direct embedding indexing failed:', innerErr);
      }
    });
  }
}
