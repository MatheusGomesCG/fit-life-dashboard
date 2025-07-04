
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://attubruszbhhkjbbqcgp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dHVicnVzemJoaGtqYmJxY2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDU0NzUsImV4cCI6MjA2NDQ4MTQ3NX0.ERPeTiDlE6mk74APuh4Pd6TS2-ZUl42dh_qDsuQALVE";

// Verificação das variáveis de ambiente
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error("❌ [Supabase Client] Variáveis do Supabase não encontradas!");
  throw new Error("Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.");
}

console.log("✅ [Supabase Client] Configuração carregada:", {
  url: SUPABASE_URL,
  hasKey: !!SUPABASE_PUBLISHABLE_KEY
});

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
