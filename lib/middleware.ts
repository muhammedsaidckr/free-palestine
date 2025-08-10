import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

// Common rate limits
export const RateLimits = {
  contact: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5,
    message: 'Too many contact form submissions. Please try again later.'
  },
  newsletter: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 3,
    message: 'Too many newsletter subscription attempts. Please try again later.'
  },
  petition: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 3,
    message: 'Too many petition signing attempts. Please try again later.'
  },
  news: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many news requests. Please try again later.'
  }
};

// Validation schemas
export const CommonSchemas = {
  contact: {
    validation: (data: unknown) => {
      const errors: string[] = [];
      const record = data as Record<string, unknown>;
      
      if (!record.name || typeof record.name !== 'string' || record.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
      
      if (!record.email || typeof record.email !== 'string' || !isValidEmail(record.email)) {
        errors.push('Valid email address is required');
      }
      
      if (!record.subject || typeof record.subject !== 'string' || record.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
      }
      
      if (!record.message || typeof record.message !== 'string' || record.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
      }
      
      return { valid: errors.length === 0, errors };
    },
    sanitization: (data: unknown) => {
      const record = data as Record<string, unknown>;
      return {
        name: sanitizeString(record.name),
        email: typeof record.email === 'string' ? record.email.toLowerCase().trim() : '',
        subject: sanitizeString(record.subject),
        message: sanitizeString(record.message)
      };
    }
  },
  newsletter: {
    validation: (data: unknown) => {
      const errors: string[] = [];
      const record = data as Record<string, unknown>;
      
      if (!record.email || typeof record.email !== 'string' || !isValidEmail(record.email)) {
        errors.push('Valid email address is required');
      }
      
      if (record.firstName && (typeof record.firstName !== 'string' || record.firstName.length > 50)) {
        errors.push('First name must be less than 50 characters if provided');
      }
      
      return { valid: errors.length === 0, errors };
    },
    sanitization: (data: unknown) => {
      const record = data as Record<string, unknown>;
      return {
        email: typeof record.email === 'string' ? record.email.toLowerCase().trim() : '',
        firstName: record.firstName ? sanitizeString(record.firstName) : undefined,
        interests: Array.isArray(record.interests) ? record.interests.slice(0, 10) : []
      };
    }
  },
  petition: {
    validation: (data: unknown) => {
      const errors: string[] = [];
      const record = data as Record<string, unknown>;
      
      if (!record.email || typeof record.email !== 'string' || !isValidEmail(record.email)) {
        errors.push('Valid email address is required');
      }
      
      if (!record.firstName || typeof record.firstName !== 'string' || record.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
      }
      
      if (!record.lastName || typeof record.lastName !== 'string' || record.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
      }
      
      if (record.city && (typeof record.city !== 'string' || record.city.length > 100)) {
        errors.push('City must be less than 100 characters if provided');
      }
      
      return { valid: errors.length === 0, errors };
    },
    sanitization: (data: unknown) => {
      const record = data as Record<string, unknown>;
      return {
        email: typeof record.email === 'string' ? record.email.toLowerCase().trim() : '',
        firstName: sanitizeString(record.firstName),
        lastName: sanitizeString(record.lastName),
        city: record.city ? sanitizeString(record.city) : undefined
      };
    }
  }
};

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>"'&]/g, '').substring(0, 1000);
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('cf-connecting-ip');
  const realIp = request.headers.get('x-real-ip');
  const forwardedFor = request.headers.get('x-forwarded-for');
  
  return forwarded || realIp || forwardedFor?.split(',')[0] || 'unknown';
}

function isRateLimited(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(key);
  }
  
  const currentEntry = rateLimitStore.get(key);
  
  if (!currentEntry) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return false;
  }
  
  if (currentEntry.count >= config.maxRequests) {
    return true;
  }
  
  currentEntry.count++;
  return false;
}

// Middleware configuration
interface MiddlewareConfig {
  validation?: (data: unknown) => { valid: boolean; errors: string[] };
  sanitization?: (data: unknown) => unknown;
  rateLimit?: RateLimitConfig;
}

// Main middleware function
export function withMiddleware(config: MiddlewareConfig) {
  return function(handler: (...args: unknown[]) => Promise<NextResponse>) {
    return async function(request: NextRequest) {
      try {
        // Rate limiting
        if (config.rateLimit) {
          const rateLimitKey = getRateLimitKey(request);
          if (isRateLimited(rateLimitKey, config.rateLimit)) {
            return NextResponse.json(
              { error: config.rateLimit.message },
              { status: 429 }
            );
          }
        }

        let validatedData: unknown = {};

        // For POST requests, validate and sanitize data
        if (request.method === 'POST') {
          const body = await request.json();
          
          // Validation
          if (config.validation) {
            const validation = config.validation(body);
            if (!validation.valid) {
              return NextResponse.json(
                { error: validation.errors[0] },
                { status: 400 }
              );
            }
          }
          
          // Sanitization
          if (config.sanitization) {
            validatedData = config.sanitization(body);
          } else {
            validatedData = body;
          }
        }

        // Call the handler with request and validated data
        return await handler(request, validatedData);
        
      } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  };
}