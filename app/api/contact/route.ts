import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, saveContact } from '../../../functions/_lib/database';
import { sendContactNotification, sendAutoReply } from '../../../functions/_lib/email';
import { withMiddleware, CommonSchemas, RateLimits } from '../../../lib/middleware';

interface Env extends Record<string, string | undefined> {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
}

async function handleContactSubmission(...args: unknown[]) {
  const [request, validatedData] = args as [NextRequest, Record<string, unknown>];
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      RESEND_API_KEY: process.env.RESEND_API_KEY!,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    };

    const supabase = createSupabaseClient(env);
    const { name, email, subject, message } = validatedData;

    const contactData = { 
      name: name as string, 
      email: email as string, 
      subject: subject as string, 
      message: message as string 
    };

    // Save to database
    await saveContact(supabase, contactData);

    // Send notifications
    try {
      await Promise.all([
        sendContactNotification(env, contactData),
        sendAutoReply(env, contactData)
      ]);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if emails fail
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export const POST = withMiddleware({
  validation: CommonSchemas.contact.validation,
  sanitization: CommonSchemas.contact.sanitization,
  rateLimit: RateLimits.contact
})(handleContactSubmission);