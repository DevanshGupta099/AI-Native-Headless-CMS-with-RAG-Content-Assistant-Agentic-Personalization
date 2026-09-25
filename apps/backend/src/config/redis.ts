import Redis from 'ioredis';
import { env } from './env';

let hasWarned = false;

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 3) {
      if (!hasWarned) {
        console.warn('⚠️ Redis offline. Background queue will fallback to immediate asynchronous execution.');
        hasWarned = true;
      }
      return null;
    }
    return Math.min(times * 1000, 3000);
  },
});

redis.on('error', (err) => {
  if (!hasWarned) {
    console.warn('⚠️ Redis connection warning:', err.message);
  }
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis successfully');
});
