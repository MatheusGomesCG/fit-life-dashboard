
import { supabase } from "@/integrations/supabase/client";

export interface RegistroCarga {
  id?: string;
  user_id: string;
  exercise_id: string;
  peso: number;
  repeticoes: number;
  data: string;
  created_at?: string;
}

export const registrarCarga = async (registro: Omit<RegistroCarga, "id" | "created_at">): Promise<RegistroCarga> => {
  try {
    const { data, error } = await supabase
      .from('registros_carga')
      .insert(registro)
      .select()
      .single();

    if (error) throw error;
    return data as RegistroCarga;
  } catch (error) {
    console.error("Erro ao registrar carga:", error);
    throw error;
  }
};

export const buscarProgressaoCarga = async (userId: string, exerciseId: string): Promise<RegistroCarga[]> => {
  try {
    const { data, error } = await supabase
      .from('registros_carga')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('data', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar progressão de carga:", error);
    throw error;
  }
};

export const buscarUltimaCarga = async (userId: string, exerciseId: string): Promise<RegistroCarga | null> => {
  try {
    const { data, error } = await supabase
      .from('registros_carga')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('data', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error("Erro ao buscar última carga:", error);
    return null;
  }
};
