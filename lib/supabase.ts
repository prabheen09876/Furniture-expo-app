import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Get environment variables with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url === 'your_supabase_project_url_here') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidKey = (key: string | undefined): boolean => {
  return !!(key && key !== 'your_supabase_anon_key_here' && key.length > 10);
};

// Create a mock client for development when credentials are not set
const createMockClient = () => {
  console.warn('⚠️ Supabase credentials not configured. Using mock client for development.');
  console.warn('Please update your .env file with valid Supabase credentials.');
  
  return {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  } as any;
};

// Export the Supabase client
export const supabase = 
  isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)
    ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
    : createMockClient();