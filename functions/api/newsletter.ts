import { createSupabaseClient, saveNewsletterSubscription, getNewsletterSubscription, getNewsletterSubscriberCount } from '../_lib/database';
import { isValidEmail, sendNewsletterWelcome } from '../_lib/email';

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const supabase = createSupabaseClient(context.env);
    const body = await context.request.json() as any;
    const { email, firstName, interests } = body;

    // Basic validation
    if (!email) {
      return Response.json(
        { error: 'Email address is required' },
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

    // Check if already subscribed
    const existingSubscription = await getNewsletterSubscription(supabase, email);
    if (existingSubscription) {
      return Response.json(
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
      await sendNewsletterWelcome(context.env, {
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
    
    return Response.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function onRequestGet(context: { env: Env }) {
  try {
    const supabase = createSupabaseClient(context.env);
    // Return subscriber count for admin purposes
    const count = await getNewsletterSubscriberCount(supabase);
    return Response.json({
      subscriberCount: count
    });
  } catch (error) {
    console.error('Failed to get subscriber count:', error);
    return Response.json(
      { error: 'Failed to get subscriber count' },
      { status: 500 }
    );
  }
}