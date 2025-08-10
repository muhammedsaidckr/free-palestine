import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface PetitionSignature {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  city?: string;
  timestamp: string;
  ipAddress: string;
}

interface PetitionData {
  signatures: PetitionSignature[];
  totalCount: number;
  lastUpdated: string;
}

const PETITION_FILE = join(process.cwd(), 'data', 'petition.json');

function ensureDataDirectory() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

function loadPetitionData(): PetitionData {
  ensureDataDirectory();
  
  if (!existsSync(PETITION_FILE)) {
    const initialData: PetitionData = {
      signatures: [],
      totalCount: 2847, // Starting with the current count from the UI
      lastUpdated: new Date().toISOString()
    };
    writeFileSync(PETITION_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  try {
    const data = readFileSync(PETITION_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading petition data:', error);
    return {
      signatures: [],
      totalCount: 2847,
      lastUpdated: new Date().toISOString()
    };
  }
}

function savePetitionData(data: PetitionData) {
  try {
    writeFileSync(PETITION_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving petition data:', error);
    throw new Error('Failed to save petition data');
  }
}

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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
    const data = loadPetitionData();
    return NextResponse.json({
      totalCount: data.totalCount,
      lastUpdated: data.lastUpdated
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

    const data = loadPetitionData();

    // Check if email already exists
    const existingSignature = data.signatures.find(sig => 
      sig.email.toLowerCase() === email.toLowerCase()
    );

    if (existingSignature) {
      return NextResponse.json(
        { error: 'This email has already signed the petition' },
        { status: 409 }
      );
    }

    // Create new signature
    const newSignature: PetitionSignature = {
      id: generateId(),
      email: sanitizeInput(email.toLowerCase()),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      city: city ? sanitizeInput(city) : undefined,
      timestamp: new Date().toISOString(),
      ipAddress: getClientIP(request)
    };

    // Add signature and update count
    data.signatures.push(newSignature);
    data.totalCount = data.signatures.length + 2847; // Base count + new signatures
    data.lastUpdated = new Date().toISOString();

    // Save to file
    savePetitionData(data);

    return NextResponse.json({
      success: true,
      totalCount: data.totalCount,
      message: 'Petition signed successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing petition signature:', error);
    return NextResponse.json(
      { error: 'Failed to process petition signature' },
      { status: 500 }
    );
  }
}