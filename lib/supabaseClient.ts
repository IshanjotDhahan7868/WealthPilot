import { createClient } from '@supabase/supabase-js';

// Supabase client. The URL and anon key come from NEXT_PUBLIC env variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);