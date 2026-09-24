import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.warn('⚠️ Redis connection warning:', err.message);
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis successfully');
});
