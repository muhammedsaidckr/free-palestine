import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, saveNewsletterSubscription, getNewsletterSubscription, getNewsletterSubscriberCount } from '../../../functions/_lib/database';
import { sendNewsletterWelcome } from '../../../functions/_lib/email';
import { withMiddleware, CommonSchemas, RateLimits } from '../../../lib/middleware';

interface Env extends Record<string, string | undefined> {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
}

async function handleNewsletterSubscription(...args: unknown[]) {
  const [, validatedData] = args as [NextRequest, Record<string, unknown>];
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    };

    const supabase = createSupabaseClient(env);
    const { email, firstName, interests } = validatedData;

    // Check if already subscribed
    const existingSubscription = await getNewsletterSubscription(supabase, email as string);
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This email address is already subscribed' },
        { status: 409 }
      );
    }

    // Save to database
    const subscription = await saveNewsletterSubscription(supabase, {
      email: email as string,
      first_name: (firstName as string) || undefined,
      interests: (interests as string[]) || []
    });

    // Send welcome email
    try {
      await sendNewsletterWelcome(env, {
        email: subscription.email,
        firstName: subscription.first_name
      });
    } catch (emailError) {
      console.warn('Failed to send welcome email:', emailError);
    }

    console.log('Newsletter subscription saved:', {
      id: subscription.id,
      email: subscription.email,
      firstName: subscription.first_name,
      interests: subscription.interests,
      timestamp: subscription.created_at
    });
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleGetSubscriberCount(...args: unknown[]) {
  const [] = args as [NextRequest];
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    };

    const supabase = createSupabaseClient(env);
    const count = await getNewsletterSubscriberCount(supabase);
    return NextResponse.json({
      subscriberCount: count
    });
  } catch (error) {
    console.error('Failed to get subscriber count:', error);
    return NextResponse.json(
      { error: 'Failed to get subscriber count' },
      { status: 500 }
    );
  }
}

export const POST = withMiddleware({
  validation: CommonSchemas.newsletter.validation,
  sanitization: CommonSchemas.newsletter.sanitization,
  rateLimit: RateLimits.newsletter
})(handleNewsletterSubscription);

export const GET = withMiddleware({
  rateLimit: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many requests for subscriber count.'
  }
})(handleGetSubscriberCount);