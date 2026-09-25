import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Enterprise HTTP Security Headers (OWASP compliant)
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Clickjacking defense
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Legacy XSS filter activation
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Privacy defense on cross-origin referrers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict sensitive browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove Express fingerprint
  res.removeHeader('X-Powered-By');

  next();
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

/**
 * Production-ready in-memory sliding window rate limiter
 */
export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}) {
  const store = new Map<string, RateLimitRecord>();

  // Background cleanup every 2 minutes to prevent memory leaks
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  }, 120_000);

  // Prevent timer from blocking process exit
  if (interval.unref) interval.unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = options.keyGenerator ? options.keyGenerator(req) : (req.ip || req.socket.remoteAddress || 'unknown');
    const now = Date.now();

    const record = store.get(key);

    if (!record || now > record.resetAt) {
      store.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', options.maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + options.windowMs) / 1000));
      return next();
    }

    record.count++;
    const remaining = Math.max(0, options.maxRequests - record.count);
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

    if (record.count > options.maxRequests) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      throw new AppError(
        options.message || 'Too many requests, please try again later.',
        429,
        'RATE_LIMITED'
      );
    }

    next();
  };
}

// Preset rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 30, // 30 login/register attempts
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
});

export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 queries/min to protect Groq/HF quotas
  message: 'AI assistant rate limit reached. Please wait a moment before sending more queries.',
});

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 500, // 500 requests per IP per window
  message: 'Global API rate limit exceeded.',
});
