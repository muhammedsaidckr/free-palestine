import { NextRequest, NextResponse } from 'next/server';
import { 
  savePetitionSignature, 
  getPetitionSignature, 
  getPetitionSignatureCount 
} from '@/lib/database';

function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  return 'unknown';
}


function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function GET() {
  try {
    const totalCount = await getPetitionSignatureCount();
    return NextResponse.json({
      totalCount,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching petition data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch petition data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, city } = body;

    // Validation
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        { error: 'First name and last name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSignature = await getPetitionSignature(email);
    if (existingSignature) {
      return NextResponse.json(
        { error: 'This email has already signed the petition' },
        { status: 409 }
      );
    }

    // Create new signature
    const newSignature = {
      email: sanitizeInput(email.toLowerCase()),
      first_name: sanitizeInput(firstName),
      last_name: sanitizeInput(lastName),
      city: city ? sanitizeInput(city) : undefined,
      ip_address: getClientIP(request)
    };

    // Save to database
    await savePetitionSignature(newSignature);

    // Get updated count
    const totalCount = await getPetitionSignatureCount();

    return NextResponse.json({
      success: true,
      totalCount,
      message: 'Petition signed successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing petition signature:', error);
    
    if (error instanceof Error && error.message.includes('already signed')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process petition signature' },
      { status: 500 }
    );
  }
}