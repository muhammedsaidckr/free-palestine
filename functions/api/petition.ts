import { createSupabaseClient, savePetitionSignature, getPetitionSignature, getPetitionSignatureCount } from '../_lib/database';
import { isValidEmail, sanitizeInput, getClientIP } from '../_lib/email';

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export async function onRequestGet(context: { env: Env }) {
  try {
    const supabase = createSupabaseClient(context.env);
    const totalCount = await getPetitionSignatureCount(supabase);
    
    return Response.json({
      totalCount,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching petition data:', error);
    return Response.json(
      { error: 'Failed to fetch petition data' },
      { status: 500 }
    );
  }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const supabase = createSupabaseClient(context.env);
    const body = await context.request.json() as any;
    const { email, firstName, lastName, city } = body;

    // Validation
    if (!email || !firstName || !lastName) {
      return Response.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return Response.json(
        { error: 'First name and last name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSignature = await getPetitionSignature(supabase, email);
    if (existingSignature) {
      return Response.json(
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
      ip_address: getClientIP(context.request)
    };

    // Save to database
    await savePetitionSignature(supabase, newSignature);

    // Get updated count
    const totalCount = await getPetitionSignatureCount(supabase);

    return Response.json({
      success: true,
      totalCount,
      message: 'Petition signed successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing petition signature:', error);
    
    if (error instanceof Error && error.message.includes('already signed')) {
      return Response.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return Response.json(
      { error: 'Failed to process petition signature' },
      { status: 500 }
    );
  }
}