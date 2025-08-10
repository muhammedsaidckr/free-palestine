import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create Supabase client for Cloudflare Workers
export function createSupabaseClient(env: any): SupabaseClient {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
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

export interface NewsletterSubscription {
  id?: number;
  email: string;
  first_name?: string;
  interests?: string[];
  created_at?: string;
}

export async function saveContact(supabase: SupabaseClient, contact: Omit<ContactSubmission, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select();

  if (error) {
    throw new Error(`Failed to save contact: ${error.message}`);
  }

  return data[0];
}

export async function savePetitionSignature(supabase: SupabaseClient, signature: Omit<PetitionSignature, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('petition_signatures')
    .insert([signature])
    .select();

  if (error) {
    throw new Error(`Failed to save petition signature: ${error.message}`);
  }

  return data[0];
}

export async function getPetitionSignature(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from('petition_signatures')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get petition signature: ${error.message}`);
  }

  return data;
}

export async function getPetitionSignatureCount(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('petition_signatures')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to get petition count: ${error.message}`);
  }

  return count || 0;
}

export async function saveNewsletterSubscription(supabase: SupabaseClient, subscription: Omit<NewsletterSubscription, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert([subscription])
    .select();

  if (error) {
    throw new Error(`Failed to save newsletter subscription: ${error.message}`);
  }

  return data[0];
}

export async function getNewsletterSubscription(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get newsletter subscription: ${error.message}`);
  }

  return data;
}

export async function getNewsletterSubscriberCount(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to get newsletter subscriber count: ${error.message}`);
  }

  return count || 0;
}