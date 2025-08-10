import { NextResponse } from 'next/server';
import { saveNewsletterSubscription, getNewsletterSubscription, getNewsletterSubscriberCount } from '@/lib/database';
import { sendNewsletterWelcome } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscription = await getNewsletterSubscription(email);
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'This email address is already subscribed' },
        { status: 409 }
      );
    }

    // Save to database
    const subscription = await saveNewsletterSubscription({
      email: email.toLowerCase(),
      first_name: firstName || null,
      interests: interests || []
    });

    // Send welcome email
    const emailResult = await sendNewsletterWelcome({
      email: subscription.email,
      firstName: subscription.first_name
    });

    if (!emailResult.success) {
      console.warn('Failed to send welcome email:', emailResult.error);
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
    // Return subscriber count for admin purposes
    const count = await getNewsletterSubscriberCount();
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