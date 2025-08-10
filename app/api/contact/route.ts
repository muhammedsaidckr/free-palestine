import { NextResponse } from 'next/server';
import { saveContact } from '@/lib/database';
import { sendContactNotification, sendAutoReply } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

    // Save to Supabase database
    try {
      await saveContact(contactData);
      console.log('Contact saved to database successfully');
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      // Continue processing even if database fails
    }

    // Send email notifications (non-blocking)
    Promise.allSettled([
      sendContactNotification(contactData),
      sendAutoReply(contactData)
    ]).then(([notificationResult, autoReplyResult]) => {
      if (notificationResult.status === 'fulfilled' && notificationResult.value.success) {
        console.log('Admin notification sent successfully');
      } else {
        console.error('Admin notification failed:', notificationResult);
      }

      if (autoReplyResult.status === 'fulfilled' && autoReplyResult.value.success) {
        console.log('Auto-reply sent successfully');
      } else {
        console.error('Auto-reply failed:', autoReplyResult);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}