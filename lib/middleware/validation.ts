import { NextRequest, NextResponse } from 'next/server';

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  enum?: (string | number)[];
  custom?: (value: unknown) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: Record<string, unknown>;
}

export function validateField(value: unknown, rule: ValidationRule, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required check
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
    return errors; // Exit early if required field is missing
  }

  // If not required and value is empty, skip other validations
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return errors;
  }

  // Type validation
  if (rule.type) {
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({ field: fieldName, message: `${fieldName} must be a string` });
        }
        break;
      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push({ field: fieldName, message: `${fieldName} must be a number` });
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({ field: fieldName, message: `${fieldName} must be a boolean` });
        }
        break;
      case 'email':
        if (typeof value === 'string' && !isValidEmail(value)) {
          errors.push({ field: fieldName, message: `${fieldName} must be a valid email address` });
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push({ field: fieldName, message: `${fieldName} must be an array` });
        }
        break;
    }
  }

  // String length validation
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must be at least ${rule.minLength} characters long` 
      });
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must be less than ${rule.maxLength} characters long` 
      });
    }
  }

  // Number range validation
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = typeof value === 'number' ? value : Number(value);
    if (rule.min !== undefined && numValue < rule.min) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must be greater than or equal to ${rule.min}` 
      });
    }
    if (rule.max !== undefined && numValue > rule.max) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must be less than or equal to ${rule.max}` 
      });
    }
  }

  // Array length validation
  if (Array.isArray(value)) {
    if (rule.minLength && value.length < rule.minLength) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must have at least ${rule.minLength} items` 
      });
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} must have less than ${rule.maxLength} items` 
      });
    }
  }

  // Pattern validation
  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      errors.push({ 
        field: fieldName, 
        message: `${fieldName} format is invalid` 
      });
    }
  }

  // Enum validation
  if (rule.enum && (typeof value === 'string' || typeof value === 'number') && !rule.enum.includes(value)) {
    errors.push({ 
      field: fieldName, 
      message: `${fieldName} must be one of: ${rule.enum.join(', ')}` 
    });
  }

  // Custom validation
  if (rule.custom) {
    const result = rule.custom(value);
    if (result !== true) {
      errors.push({ 
        field: fieldName, 
        message: typeof result === 'string' ? result : `${fieldName} is invalid` 
      });
    }
  }

  return errors;
}

export function validate(data: Record<string, unknown>, schema: ValidationSchema): ValidationResult {
  const errors: ValidationError[] = [];
  const validatedData: Record<string, unknown> = {};

  // Validate each field in the schema
  for (const [fieldName, rule] of Object.entries(schema)) {
    const fieldErrors = validateField(data[fieldName], rule, fieldName);
    errors.push(...fieldErrors);
    
    // Include the field in validated data if no errors
    if (fieldErrors.length === 0) {
      validatedData[fieldName] = data[fieldName];
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validatedData : undefined
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function withValidation(schema: ValidationSchema) {
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

        // Validate the data
        const validationResult = validate(body, schema);
        
        if (!validationResult.valid) {
          return NextResponse.json(
            { 
              error: 'Validation failed',
              details: validationResult.errors 
            },
            { status: 400 }
          );
        }

        // Call the handler with validated data
        return await handler(request, validationResult.data!);
      } catch (error) {
        console.error('Validation middleware error:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  };
}

export function createValidationMiddleware(schema: ValidationSchema) {
  return withValidation(schema);
}

// Video-specific validation schemas and functions
export const videoValidationSchema: ValidationSchema = {
  title: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 255
  },
  description: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 2000
  },
  video_id: {
    required: true,
    type: 'string',
    pattern: /^[a-zA-Z0-9_-]{11}$/, // YouTube video ID format
    custom: (value: unknown) => {
      if (typeof value !== 'string') return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(value) || 'Invalid YouTube video ID format';
    }
  },
  thumbnail_url: {
    required: false,
    type: 'string',
    pattern: /^https?:\/\/.+/,
    custom: (value: unknown) => {
      if (typeof value !== 'string') return true; // Optional field
      return /^https?:\/\/.+/.test(value) || 'Invalid URL format';
    }
  },
  category: {
    required: true,
    type: 'string',
    enum: ['documentary', 'news', 'testimony', 'solidarity', 'educational']
  },
  duration: {
    required: false,
    type: 'string',
    pattern: /^PT(\d+H)?(\d+M)?(\d+S)?$/, // ISO 8601 duration format
    custom: (value: unknown) => {
      if (typeof value !== 'string') return true; // Optional field
      return /^PT(\d+H)?(\d+M)?(\d+S)?$/.test(value) || 'Invalid duration format (use ISO 8601: PT15M30S)';
    }
  },
  published_at: {
    required: true,
    type: 'string',
    custom: (value: unknown) => {
      if (typeof value !== 'string') return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) || 'Invalid date format';
    }
  },
  is_featured: {
    required: false,
    type: 'boolean'
  },
  sort_order: {
    required: false,
    type: 'number',
    min: 0,
    max: 9999
  }
};

export const videoUpdateValidationSchema: ValidationSchema = {
  ...videoValidationSchema,
  // Make all fields optional for updates
  title: { ...videoValidationSchema.title, required: false },
  description: { ...videoValidationSchema.description, required: false },
  video_id: { ...videoValidationSchema.video_id, required: false },
  category: { ...videoValidationSchema.category, required: false },
  published_at: { ...videoValidationSchema.published_at, required: false }
};

export function validateVideoData(data: Record<string, unknown>, isCreate: boolean = true): { isValid: boolean; errors: ValidationError[] } {
  const schema = isCreate ? videoValidationSchema : videoUpdateValidationSchema;
  const result = validate(data, schema);
  
  return {
    isValid: result.valid,
    errors: result.errors
  };
}

export function sanitizeVideoData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  // Sanitize title
  if (data.title && typeof data.title === 'string') {
    sanitized.title = data.title.trim().substring(0, 255);
  }

  // Sanitize description
  if (data.description && typeof data.description === 'string') {
    sanitized.description = data.description.trim().substring(0, 2000);
  }

  // Sanitize video_id
  if (data.video_id && typeof data.video_id === 'string') {
    sanitized.video_id = data.video_id.trim();
  }

  // Sanitize thumbnail_url
  if (data.thumbnail_url && typeof data.thumbnail_url === 'string') {
    sanitized.thumbnail_url = data.thumbnail_url.trim();
  }

  // Sanitize category
  if (data.category && typeof data.category === 'string') {
    sanitized.category = data.category.toLowerCase().trim();
  }

  // Sanitize duration
  if (data.duration && typeof data.duration === 'string') {
    sanitized.duration = data.duration.trim().toUpperCase();
  }

  // Sanitize published_at
  if (data.published_at && typeof data.published_at === 'string') {
    sanitized.published_at = new Date(data.published_at).toISOString();
  }

  // Sanitize is_featured
  if (typeof data.is_featured === 'boolean') {
    sanitized.is_featured = data.is_featured;
  }

  // Sanitize sort_order
  if (data.sort_order && (typeof data.sort_order === 'number' || !isNaN(Number(data.sort_order)))) {
    sanitized.sort_order = Math.max(0, Math.min(9999, Number(data.sort_order)));
  }

  return sanitized;
}