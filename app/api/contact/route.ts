import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, saveContact } from '../../../functions/_lib/database';
import { isValidEmail, sendContactNotification, sendAutoReply } from '../../../functions/_lib/email';

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
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Length validations
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (subject.length < 5) {
      return NextResponse.json(
        { error: 'Subject must be at least 5 characters' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
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