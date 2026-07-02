import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseErrorMessage(error) {
  if (!error?.message) return '';

  if (error.message.toLowerCase().includes('invalid api key')) {
    return 'Chave do Supabase inválida. Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env pertencem ao mesmo projeto e reinicie o servidor local.';
  }

  return error.message;
}
