import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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