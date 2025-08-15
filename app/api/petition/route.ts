'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient, savePetitionSignature, getPetitionSignature, getPetitionSignatureCount } from '../../../functions/_lib/database';
import { getClientIP } from '../../../functions/_lib/email';
import { withMiddleware, CommonSchemas, RateLimits } from '../../../lib/middleware';

interface Env extends Record<string, string | undefined> {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

async function handleGetPetitionCount(...args: unknown[]) {
  const [_request] = args as [NextRequest];
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

async function handlePetitionSignature(...args: unknown[]) {
  const [request, validatedData] = args as [NextRequest, Record<string, unknown>];
  try {
    const env: Env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    };

    const supabase = createSupabaseClient(env);
    const { email, firstName, lastName, city } = validatedData;

    // Check if email already exists
    const existingSignature = await getPetitionSignature(supabase, email as string);
    if (existingSignature) {
      return NextResponse.json(
        { error: 'This email has already signed the petition' },
        { status: 409 }
      );
    }

    // Create new signature
    const newSignature = {
      email: email as string,
      first_name: firstName as string,
      last_name: lastName as string,
      city: (city as string) || undefined,
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

export const GET = withMiddleware({
  rateLimit: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Too many requests for petition count.'
  }
})(handleGetPetitionCount);

export const POST = withMiddleware({
  validation: CommonSchemas.petition.validation,
  sanitization: CommonSchemas.petition.sanitization,
  rateLimit: RateLimits.petition
})(handlePetitionSignature);
