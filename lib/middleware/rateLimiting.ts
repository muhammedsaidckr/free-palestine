import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
  statusCode?: number; // HTTP status code for rate limit exceeded
  keyGenerator?: (request: NextRequest) => string; // Custom key generator
  skipIf?: (request: NextRequest) => boolean; // Condition to skip rate limiting
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

// In-memory storage for development/simple deployments
// In production, you should use Cloudflare KV, Redis, or Durable Objects
class SimpleRateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    // Clean up expired entries
    if (Date.now() > entry.resetTime) {
      this.store.delete(key);
      return null;
    }
    
    return entry;
  }

  async set(key: string, value: { count: number; resetTime: number }): Promise<void> {
    this.store.set(key, value);
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const resetTime = now + windowMs;
    const existing = await this.get(key);

    if (!existing) {
      const newEntry = { count: 1, resetTime };
      await this.set(key, newEntry);
      return newEntry;
    }

    existing.count += 1;
    await this.set(key, existing);
    return existing;
  }

  // Cleanup expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

const store = new SimpleRateLimitStore();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  store.cleanup();
}, 5 * 60 * 1000);

export function getClientIP(request: NextRequest): string {
  // Get IP from various headers in order of reliability
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const forwardedFor = request.headers.get('forwarded');

  // Cloudflare's connecting IP is most reliable
  if (cfConnectingIP && cfConnectingIP !== '0.0.0.0') {
    return cfConnectingIP;
  }

  // Parse X-Forwarded-For header (format: client, proxy1, proxy2)
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    const clientIP = ips.find(ip => 
      ip && 
      ip !== '0.0.0.0' && 
      !ip.startsWith('127.') && 
      !ip.startsWith('10.') && 
      !ip.startsWith('192.168.') &&
      !ip.match(/^172\.(1[6-9]|2[0-9]|3[01])\./) &&
      !ip.startsWith('fe80:') &&
      !ip.startsWith('::1')
    );
    if (clientIP) return clientIP;
  }

  if (xRealIP && xRealIP !== '0.0.0.0') {
    return xRealIP;
  }

  // Parse Forwarded header (RFC 7239)
  if (forwardedFor) {
    const forwarded = forwardedFor.match(/for=([^;,]+)/i);
    if (forwarded && forwarded[1]) {
      const ip = forwarded[1].replace(/"/g, '').split(':')[0];
      if (ip && ip !== '0.0.0.0') {
        return ip;
      }
    }
  }

  return 'unknown';
}

export function defaultKeyGenerator(request: NextRequest): string {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  // Use IP and first part of user agent for key
  const uaHash = userAgent.split(' ')[0];
  return `${ip}:${uaHash}`;
}

export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    // Skip if condition is met
    if (config.skipIf && config.skipIf(request)) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
        totalHits: 0
      };
    }

    // Generate rate limit key
    const keyGenerator = config.keyGenerator || defaultKeyGenerator;
    const key = `rate_limit:${keyGenerator(request)}`;

    // Get or create rate limit entry
    const entry = await store.increment(key, config.windowMs);

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      totalHits: entry.count
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow the request if rate limiting fails
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
      totalHits: 0
    };
  }
}

export function withRateLimit(config: RateLimitConfig) {
  return function <T extends (...args: unknown[]) => Promise<NextResponse>>(
    handler: T
  ) {
    return async function (...allArgs: unknown[]): Promise<NextResponse> {
      const [request, ...args] = allArgs as [NextRequest, ...unknown[]];
      try {
        const result = await checkRateLimit(request, config);

        // Add rate limit headers to response
        const headers = new Headers();
        headers.set('X-RateLimit-Limit', config.maxRequests.toString());
        headers.set('X-RateLimit-Remaining', result.remaining.toString());
        headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

        if (!result.allowed) {
          const message = config.message || 'Too many requests, please try again later.';
          const statusCode = config.statusCode || 429;
          
          headers.set('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000).toString());
          
          return NextResponse.json(
            { error: message },
            { status: statusCode, headers }
          );
        }

        // Call the handler
        const response = await handler(request, ...args);
        
        // Add rate limit headers to successful response
        for (const [key, value] of headers.entries()) {
          response.headers.set(key, value);
        }
        
        return response;
      } catch (error) {
        console.error('Rate limiting middleware error:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  };
}

export function createRateLimitMiddleware(config: RateLimitConfig) {
  return withRateLimit(config);
}

// Predefined rate limit configurations
export const RateLimitPresets = {
  // Very strict - for sensitive operations
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many requests. Please wait 15 minutes before trying again.'
  },

  // Standard rate limit for most API endpoints
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests. Please try again later.'
  },

  // Moderate rate limit for forms
  form: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    message: 'Too many form submissions. Please wait a few minutes before trying again.'
  },

  // Lenient rate limit for read operations
  lenient: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Too many requests. Please slow down.'
  },

  // For contact forms
  contact: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 3,
    message: 'Too many contact form submissions. Please wait 10 minutes before sending another message.'
  },

  // For newsletter subscriptions
  newsletter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many newsletter subscription attempts. Please wait 15 minutes before trying again.'
  },

  // For petition signatures
  petition: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 2,
    message: 'Please wait a few minutes before signing another petition.'
  }
};