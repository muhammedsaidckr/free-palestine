import { NextRequest, NextResponse } from 'next/server';

export interface SanitizationRule {
  trim?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  removeHtml?: boolean;
  removeSpecialChars?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
  custom?: (value: unknown) => unknown;
}

export interface SanitizationSchema {
  [key: string]: SanitizationRule;
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

export function removeHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

export function removeSpecialCharacters(input: string, keep?: string): string {
  // By default, keep alphanumeric, spaces, and common punctuation
  const defaultKeep = 'a-zA-Z0-9\\s.,!?;:()\\-_@';
  const keepChars = keep || defaultKeep;
  const regex = new RegExp(`[^${keepChars}]`, 'g');
  return input.replace(regex, '');
}

export function sanitizeField(value: unknown, rule: SanitizationRule): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  let result: unknown = value;

  // Only apply string sanitization to strings
  if (typeof result === 'string') {
    let stringResult = result;

    // Trim whitespace
    if (rule.trim !== false) { // Default to true
      stringResult = stringResult.trim();
    }

    // Case transformations
    if (rule.toLowerCase) {
      stringResult = stringResult.toLowerCase();
    }
    if (rule.toUpperCase) {
      stringResult = stringResult.toUpperCase();
    }

    // Remove HTML tags
    if (rule.removeHtml) {
      stringResult = removeHtmlTags(stringResult);
    }

    // Remove special characters
    if (rule.removeSpecialChars) {
      stringResult = removeSpecialCharacters(stringResult);
    }

    // Apply allowed characters filter
    if (rule.allowedChars) {
      stringResult = stringResult.replace(new RegExp(`[^${rule.allowedChars.source}]`, 'g'), '');
    }

    // Truncate to max length
    if (rule.maxLength && stringResult.length > rule.maxLength) {
      stringResult = stringResult.substring(0, rule.maxLength);
    }

    result = stringResult;
  }

  // Apply custom sanitization
  if (rule.custom) {
    result = rule.custom(result) as unknown;
  }

  return result;
}

export function sanitize(data: Record<string, unknown>, schema: SanitizationSchema): Record<string, unknown> {
  const sanitizedData: Record<string, unknown> = { ...data };

  for (const [fieldName, rule] of Object.entries(schema)) {
    if (data[fieldName] !== undefined) {
      sanitizedData[fieldName] = sanitizeField(data[fieldName], rule);
    }
  }

  return sanitizedData;
}

export function withSanitization(schema: SanitizationSchema) {
  return function <T extends (...args: unknown[]) => Promise<NextResponse>>(
    handler: T
  ) {
    return async function (...allArgs: unknown[]): Promise<NextResponse> {
      const [request] = allArgs as [NextRequest, ...unknown[]];
      try {
        // Parse request body
        let body: Record<string, unknown>;
        try {
          body = await request.json();
        } catch {
          return NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          );
        }

        // Sanitize the data
        const sanitizedData = sanitize(body, schema);

        // Call the handler with sanitized data
        return await handler(request, sanitizedData);
      } catch (error) {
        console.error('Sanitization middleware error:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  };
}

export function createSanitizationMiddleware(schema: SanitizationSchema) {
  return withSanitization(schema);
}

// Security-focused sanitizers
export const SecuritySanitizers = {
  // Sanitize for database storage (prevent basic injection attempts)
  forDatabase: {
    trim: true,
    removeHtml: true,
    custom: (value: string) => {
      if (typeof value !== 'string') return value;
      // Remove potential SQL injection patterns (basic)
      return value
        .replace(/['";]/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '');
    }
  },

  // Sanitize email addresses
  email: {
    trim: true,
    toLowerCase: true,
    custom: (value: string) => {
      if (typeof value !== 'string') return value;
      // Remove any characters that shouldn't be in emails
      return value.replace(/[^a-zA-Z0-9@._+-]/g, '');
    }
  },

  // Sanitize names (keep letters, spaces, hyphens, apostrophes)
  name: {
    trim: true,
    removeHtml: true,
    allowedChars: /a-zA-ZÀ-ÿ\s'-/,
    maxLength: 100
  },

  // Sanitize text content (messages, descriptions)
  textContent: {
    trim: true,
    removeHtml: true,
    maxLength: 5000,
    custom: (value: string) => {
      if (typeof value !== 'string') return value;
      // Normalize line breaks and remove excessive whitespace
      return value
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ');
    }
  },

  // Sanitize subject lines
  subject: {
    trim: true,
    removeHtml: true,
    maxLength: 200,
    custom: (value: string) => {
      if (typeof value !== 'string') return value;
      // Remove line breaks from subjects
      return value.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ');
    }
  },

  // Sanitize city/location names
  location: {
    trim: true,
    removeHtml: true,
    allowedChars: /a-zA-ZÀ-ÿ\s'-.,/,
    maxLength: 100
  }
};