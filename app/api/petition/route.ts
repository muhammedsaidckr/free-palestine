import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, savePetitionSignature, getPetitionSignature, getPetitionSignatureCount } from '../../../functions/_lib/database';
import { isValidEmail, sanitizeInput, getClientIP } from '../../../functions/_lib/email';

interface Env extends Record<string, string | undefined> {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export async function GET() {
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    };

    const supabase = createSupabaseClient(env);
    const totalCount = await getPetitionSignatureCount(supabase);
    
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
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    };

    const supabase = createSupabaseClient(env);
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
    const existingSignature = await getPetitionSignature(supabase, email);
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
    await savePetitionSignature(supabase, newSignature);

    // Get updated count
    const totalCount = await getPetitionSignatureCount(supabase);

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