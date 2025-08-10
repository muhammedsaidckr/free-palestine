import { NextResponse } from 'next/server';
import { withValidation, ValidationSchema } from './validation';
import { withSanitization, SanitizationSchema } from './sanitization';
import { withRateLimit, RateLimitConfig } from './rateLimiting';

export interface MiddlewareConfig {
  validation?: ValidationSchema;
  sanitization?: SanitizationSchema;
  rateLimit?: RateLimitConfig;
}

export function compose<T>(...middlewares: Array<(handler: T) => T>) {
  return (handler: T): T => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

export function withMiddleware(config: MiddlewareConfig) {
  const middlewares: Array<(handler: (...args: unknown[]) => Promise<NextResponse>) => (...args: unknown[]) => Promise<NextResponse>> = [];

  // Add rate limiting first (outermost)
  if (config.rateLimit) {
    middlewares.push(withRateLimit(config.rateLimit));
  }

  // Add sanitization before validation
  if (config.sanitization) {
    middlewares.push(withSanitization(config.sanitization));
  }

  // Add validation last (innermost, closest to handler)
  if (config.validation) {
    middlewares.push(withValidation(config.validation));
  }

  return compose(...middlewares);
}

// Export all middleware components
export * from './validation';
export * from './sanitization';
export * from './rateLimiting';

// Common middleware configurations
export const CommonSchemas = {
  contact: {
    validation: {
      name: {
        required: true,
        type: 'string' as const,
        minLength: 2,
        maxLength: 100
      },
      email: {
        required: true,
        type: 'email' as const,
        maxLength: 254
      },
      subject: {
        required: true,
        type: 'string' as const,
        minLength: 5,
        maxLength: 200
      },
      message: {
        required: true,
        type: 'string' as const,
        minLength: 10,
        maxLength: 5000
      }
    },
    sanitization: {
      name: {
        trim: true,
        removeHtml: true,
        allowedChars: /[a-zA-ZÀ-ÿ\s'-]/,
        maxLength: 100
      },
      email: {
        trim: true,
        toLowerCase: true,
        removeHtml: true
      },
      subject: {
        trim: true,
        removeHtml: true,
        maxLength: 200,
        custom: (value: unknown) => {
          if (typeof value !== 'string') return value;
          return value.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ');
        }
      },
      message: {
        trim: true,
        removeHtml: true,
        maxLength: 5000,
        custom: (value: unknown) => {
          if (typeof value !== 'string') return value;
          return value
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[ \t]{2,}/g, ' ');
        }
      }
    }
  },

  newsletter: {
    validation: {
      email: {
        required: true,
        type: 'email' as const,
        maxLength: 254
      },
      firstName: {
        required: false,
        type: 'string' as const,
        minLength: 1,
        maxLength: 50
      },
      interests: {
        required: false,
        type: 'array' as const,
        maxLength: 10
      }
    },
    sanitization: {
      email: {
        trim: true,
        toLowerCase: true,
        removeHtml: true
      },
      firstName: {
        trim: true,
        removeHtml: true,
        allowedChars: /[a-zA-ZÀ-ÿ\s'-]/,
        maxLength: 50
      },
      interests: {
        custom: (value: unknown) => {
          if (!Array.isArray(value)) return value;
          return value
            .filter(item => typeof item === 'string' && item.trim().length > 0)
            .map(item => item.trim().substring(0, 50))
            .slice(0, 10);
        }
      }
    }
  },

  petition: {
    validation: {
      email: {
        required: true,
        type: 'email' as const,
        maxLength: 254
      },
      firstName: {
        required: true,
        type: 'string' as const,
        minLength: 2,
        maxLength: 50
      },
      lastName: {
        required: true,
        type: 'string' as const,
        minLength: 2,
        maxLength: 50
      },
      city: {
        required: false,
        type: 'string' as const,
        minLength: 2,
        maxLength: 100
      }
    },
    sanitization: {
      email: {
        trim: true,
        toLowerCase: true,
        removeHtml: true
      },
      firstName: {
        trim: true,
        removeHtml: true,
        allowedChars: /[a-zA-ZÀ-ÿ\s'-]/,
        maxLength: 50
      },
      lastName: {
        trim: true,
        removeHtml: true,
        allowedChars: /[a-zA-ZÀ-ÿ\s'-]/,
        maxLength: 50
      },
      city: {
        trim: true,
        removeHtml: true,
        allowedChars: /[a-zA-ZÀ-ÿ\s'-.]/,
        maxLength: 100
      }
    }
  }
};

// Predefined rate limits for different endpoints
export const RateLimits = {
  contact: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 3,
    message: 'Too many contact form submissions. Please wait 10 minutes before sending another message.'
  },
  newsletter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many newsletter subscription attempts. Please wait 15 minutes before trying again.'
  },
  petition: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 2,
    message: 'Please wait a few minutes before signing another petition.'
  },
  news: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many requests. Please wait a moment before requesting news again.'
  }
};