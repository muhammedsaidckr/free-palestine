import { createClient } from '@supabase/supabase-js';

// Function to create Supabase client with environment variables
function createSupabaseClient(env?: Record<string, string>) {
  let supabaseUrl: string;
  let supabaseKey: string;
  
  if (env) {
    // Cloudflare Workers environment
    supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
    supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  } else if (typeof process !== 'undefined' && process.env) {
    // Next.js environment
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  } else {
    supabaseUrl = '';
    supabaseKey = '';
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Default client for Next.js
export const supabase = createSupabaseClient();

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export async function saveContact(contact: Omit<ContactSubmission, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select();

  if (error) {
    throw new Error(`Failed to save contact: ${error.message}`);
  }

  return data[0];
}

export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch contacts: ${error.message}`);
  }

  return data;
}

export interface NewsletterSubscription {
  id?: number;
  email: string;
  first_name?: string;
  interests?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function saveNewsletterSubscription(subscription: Omit<NewsletterSubscription, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert([{
      ...subscription,
      updated_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('This email address is already subscribed');
    }
    throw new Error(`Failed to save newsletter subscription: ${error.message}`);
  }

  return data[0];
}

export async function getNewsletterSubscription(email: string) {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw new Error(`Failed to fetch subscription: ${error.message}`);
  }

  return data;
}

export async function getNewsletterSubscriptions() {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  }

  return data;
}

export async function getNewsletterSubscriberCount() {
  const { count, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    throw new Error(`Failed to fetch subscriber count: ${error.message}`);
  }

  return count || 0;
}

export interface PetitionSignature {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  city?: string;
  ip_address?: string;
  created_at?: string;
}

export async function savePetitionSignature(signature: Omit<PetitionSignature, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('petition_signatures')
    .insert([signature])
    .select();

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email has already signed the petition');
    }
    throw new Error(`Failed to save petition signature: ${error.message}`);
  }

  return data[0];
}

export async function getPetitionSignature(email: string) {
  const { data, error } = await supabase
    .from('petition_signatures')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch petition signature: ${error.message}`);
  }

  return data;
}

export async function getPetitionSignatureCount() {
  const { count, error } = await supabase
    .from('petition_signatures')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to fetch petition signature count: ${error.message}`);
  }

  return (count || 0) + 2847; // Base count from original implementation
}

export async function getPetitionSignatures() {
  const { data, error } = await supabase
    .from('petition_signatures')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch petition signatures: ${error.message}`);
  }

  return data;
}