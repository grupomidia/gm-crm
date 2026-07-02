import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidUrl =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co');

const hasValidKey =
  typeof supabaseAnonKey === 'string' &&
  (
    supabaseAnonKey.startsWith('eyJ') ||
    supabaseAnonKey.startsWith('sb_publishable_')
  );

export const isSupabaseConfigured = hasValidUrl && hasValidKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseErrorMessage(error) {
  if (!error) return '';

  if (!isSupabaseConfigured) {
    return 'Chave do Supabase inválida. Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env pertencem ao mesmo projeto e reinicie o servidor local.';
  }

  return error.message || 'Erro ao conectar ao Supabase.';
}