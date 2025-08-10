import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, saveNewsletterSubscription, getNewsletterSubscription, getNewsletterSubscriberCount } from '../../../functions/_lib/database';
import { isValidEmail, sendNewsletterWelcome } from '../../../functions/_lib/email';

interface Env extends Record<string, string | undefined> {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
}

export async function POST(request: NextRequest) {
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    };

    const supabase = createSupabaseClient(env);
    const body = await request.json();
    const { email, firstName, interests } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscription = await getNewsletterSubscription(supabase, email);
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This email address is already subscribed' },
        { status: 409 }
      );
    }

    // Save to database
    const subscription = await saveNewsletterSubscription(supabase, {
      email: email.toLowerCase(),
      first_name: firstName || null,
      interests: interests || []
    });

    // Send welcome email (logged for now)
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

export async function GET() {
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    };

    const supabase = createSupabaseClient(env);
    // Return subscriber count for admin purposes
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