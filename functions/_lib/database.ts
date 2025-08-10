import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';

interface DatabaseOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  poolSize?: number;
}

class DatabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class ConnectionPoolError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionPoolError';
  }
}

const DEFAULT_OPTIONS: Required<DatabaseOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  poolSize: 10
};

let clientPool: Map<string, SupabaseClient> = new Map();
let poolMetrics = { active: 0, total: 0 };

export function createSupabaseClient(
  env: Record<string, string | undefined>, 
  options: DatabaseOptions = {}
): SupabaseClient {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new ConnectionPoolError('Missing Supabase environment variables');
  }
  
  const config = { ...DEFAULT_OPTIONS, ...options };
  const poolKey = `${supabaseUrl}-${supabaseKey}`;
  
  if (clientPool.has(poolKey) && poolMetrics.active < config.poolSize) {
    poolMetrics.active++;
    return clientPool.get(poolKey)!;
  }
  
  if (poolMetrics.total >= config.poolSize) {
    throw new ConnectionPoolError(`Connection pool limit exceeded (${config.poolSize})`);
  }
  
  const client = createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: (url, options = {}) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        return fetch(url, {
          ...options,
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
      }
    }
  });
  
  clientPool.set(poolKey, client);
  poolMetrics.total++;
  poolMetrics.active++;
  
  return client;
}

export function releaseConnection(): void {
  if (poolMetrics.active > 0) {
    poolMetrics.active--;
  }
}

export function getPoolMetrics() {
  return { ...poolMetrics };
}

export function clearConnectionPool(): void {
  clientPool.clear();
  poolMetrics = { active: 0, total: 0 };
}

async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = DEFAULT_OPTIONS.maxRetries,
  delay: number = DEFAULT_OPTIONS.retryDelay
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) break;
      
      if (error instanceof DatabaseError && error.code === 'PGRST301') {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
    }
  }
  
  throw new DatabaseError(
    `Operation failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`,
    'RETRY_EXHAUSTED',
    { originalError: lastError, attempts: maxRetries + 1 }
  );
}

function handleSupabaseError(error: PostgrestError, operation: string): never {
  throw new DatabaseError(
    `${operation}: ${error.message}`,
    error.code,
    { hint: error.hint, details: error.details }
  );
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

export async function saveContact(
  supabase: SupabaseClient, 
  contact: Omit<ContactSubmission, 'id' | 'created_at'>
): Promise<ContactSubmission> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'Failed to save contact');
    }

    if (!data) {
      throw new DatabaseError('No data returned after contact save', 'NO_DATA');
    }

    return data;
  });
}

export async function savePetitionSignature(
  supabase: SupabaseClient, 
  signature: Omit<PetitionSignature, 'id' | 'created_at'>
): Promise<PetitionSignature> {
  return withRetry(async () => {
    const existingSignature = await getPetitionSignature(supabase, signature.email)
      .catch(err => {
        if (err.message.includes('PGRST116')) return null;
        throw err;
      });
    
    if (existingSignature) {
      throw new DatabaseError('Email already signed petition', 'DUPLICATE_SIGNATURE', { email: signature.email });
    }

    const { data, error } = await supabase
      .from('petition_signatures')
      .insert([signature])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'Failed to save petition signature');
    }

    if (!data) {
      throw new DatabaseError('No data returned after petition signature save', 'NO_DATA');
    }

    return data;
  });
}

export async function getPetitionSignature(
  supabase: SupabaseClient, 
  email: string
): Promise<PetitionSignature | null> {
  return withRetry(async () => {
    if (!email?.trim()) {
      throw new DatabaseError('Email is required', 'INVALID_INPUT');
    }

    const { data, error } = await supabase
      .from('petition_signatures')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error, 'Failed to get petition signature');
    }

    return data;
  });
}

const signatureCountCache = new Map<string, { count: number; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function getPetitionSignatureCount(
  supabase: SupabaseClient, 
  useCache: boolean = true
): Promise<number> {
  const cacheKey = 'petition_count';
  
  if (useCache && signatureCountCache.has(cacheKey)) {
    const cached = signatureCountCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.count;
    }
  }

  return withRetry(async () => {
    const { count, error } = await supabase
      .from('petition_signatures')
      .select('*', { count: 'exact', head: true });

    if (error) {
      handleSupabaseError(error, 'Failed to get petition count');
    }

    const result = count || 0;
    
    if (useCache) {
      signatureCountCache.set(cacheKey, { count: result, timestamp: Date.now() });
    }

    return result;
  });
}

export async function saveNewsletterSubscription(
  supabase: SupabaseClient, 
  subscription: Omit<NewsletterSubscription, 'id' | 'created_at'>
): Promise<NewsletterSubscription> {
  return withRetry(async () => {
    const existingSubscription = await getNewsletterSubscription(supabase, subscription.email)
      .catch(err => {
        if (err.message.includes('PGRST116')) return null;
        throw err;
      });
    
    if (existingSubscription) {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update(subscription)
        .eq('email', subscription.email)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'Failed to update newsletter subscription');
      }

      if (!data) {
        throw new DatabaseError('No data returned after newsletter subscription update', 'NO_DATA');
      }

      return data;
    }

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([subscription])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'Failed to save newsletter subscription');
    }

    if (!data) {
      throw new DatabaseError('No data returned after newsletter subscription save', 'NO_DATA');
    }

    return data;
  });
}

export async function getNewsletterSubscription(
  supabase: SupabaseClient, 
  email: string
): Promise<NewsletterSubscription | null> {
  return withRetry(async () => {
    if (!email?.trim()) {
      throw new DatabaseError('Email is required', 'INVALID_INPUT');
    }

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error, 'Failed to get newsletter subscription');
    }

    return data;
  });
}

const subscriberCountCache = new Map<string, { count: number; timestamp: number }>();

export async function getNewsletterSubscriberCount(
  supabase: SupabaseClient,
  useCache: boolean = true
): Promise<number> {
  const cacheKey = 'subscriber_count';
  
  if (useCache && subscriberCountCache.has(cacheKey)) {
    const cached = subscriberCountCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.count;
    }
  }

  return withRetry(async () => {
    const { count, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      handleSupabaseError(error, 'Failed to get newsletter subscriber count');
    }

    const result = count || 0;
    
    if (useCache) {
      subscriberCountCache.set(cacheKey, { count: result, timestamp: Date.now() });
    }

    return result;
  });
}

export async function batchInsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: T[],
  batchSize: number = 100
): Promise<T[]> {
  if (records.length === 0) return [];
  
  const batches: T[][] = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }
  
  const results: T[] = [];
  
  for (const batch of batches) {
    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from(table)
        .insert(batch)
        .select();
      
      if (error) {
        handleSupabaseError(error, `Failed to batch insert into ${table}`);
      }
      
      return data || [];
    });
    
    results.push(...result);
  }
  
  return results;
}

export async function batchUpsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: T[],
  conflictColumns: string[],
  batchSize: number = 100
): Promise<T[]> {
  if (records.length === 0) return [];
  
  const batches: T[][] = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }
  
  const results: T[] = [];
  
  for (const batch of batches) {
    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from(table)
        .upsert(batch, { 
          onConflict: conflictColumns.join(','),
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        handleSupabaseError(error, `Failed to batch upsert into ${table}`);
      }
      
      return data || [];
    });
    
    results.push(...result);
  }
  
  return results;
}

export function clearAllCaches(): void {
  signatureCountCache.clear();
  subscriberCountCache.clear();
}

export function getCacheStats() {
  return {
    signatureCount: {
      size: signatureCountCache.size,
      entries: Array.from(signatureCountCache.entries()).map(([key, value]) => ({
        key,
        count: value.count,
        age: Date.now() - value.timestamp
      }))
    },
    subscriberCount: {
      size: subscriberCountCache.size,
      entries: Array.from(subscriberCountCache.entries()).map(([key, value]) => ({
        key,
        count: value.count,
        age: Date.now() - value.timestamp
      }))
    }
  };
}