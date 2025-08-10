import { NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In a real application, you'd use a database
const subscribers = new Set<string>();

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
    if (subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email address is already subscribed' },
        { status: 409 }
      );
    }

    // Add to subscribers
    subscribers.add(email.toLowerCase());

    // Here you would typically:
    // 1. Save to database with subscriber details
    // 2. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 3. Send welcome email
    // 4. Queue for processing, etc.
    
    // For now, we'll just log the subscription and return success
    console.log('Newsletter subscription:', {
      email,
      firstName: firstName || null,
      interests: interests || [],
      timestamp: new Date().toISOString()
    });

    // In a real application, you might want to:
    // - Save to a database (PostgreSQL, MongoDB, etc.)
    // - Integrate with email marketing service
    // - Send a welcome email
    // - Add to analytics/tracking
    
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
  // Return subscriber count for admin purposes
  return NextResponse.json({
    subscriberCount: subscribers.size
  });
}