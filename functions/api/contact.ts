import { createSupabaseClient, saveContact } from '../_lib/database';
import { isValidEmail, sendContactNotification, sendAutoReply } from '../_lib/email';

interface Env extends Record<string, string | undefined> {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('cf-connecting-ip');
  const realIp = request.headers.get('x-real-ip');
  const forwardedFor = request.headers.get('x-forwarded-for');
  
  return forwarded || realIp || forwardedFor?.split(',')[0] || 'unknown';
}

function isRateLimited(key: string, maxRequests: number = 5, windowMs: number = 300000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (entry.count >= maxRequests) {
    return true;
  }
  
  entry.count++;
  return false;
}

function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    cleanupRateLimit();
    
    const rateLimitKey = getRateLimitKey(context.request);
    if (isRateLimited(rateLimitKey)) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const supabase = createSupabaseClient(context.env);
    const body = await context.request.json() as any;
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!isValidEmail(email)) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Length validations
    if (name.length < 2) {
      return Response.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (subject.length < 5) {
      return Response.json(
        { error: 'Subject must be at least 5 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return Response.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    const contactData = { name, email, subject, message };

    // Save to database
    await saveContact(supabase, contactData);

    // Send notifications (logged for now)
    try {
      await Promise.all([
        sendContactNotification(context.env, contactData),
        sendAutoReply(context.env, contactData)
      ]);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if emails fail
    }

    return Response.json(
      { message: 'Contact form submitted successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}