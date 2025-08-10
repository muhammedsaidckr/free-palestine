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