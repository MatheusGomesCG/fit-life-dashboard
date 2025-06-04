
import { supabase } from "@/integrations/supabase/client";

export interface ProfessorRegistrationToken {
  id?: string;
  token: string;
  professor_email: string;
  professor_nome: string;
  tipo_plano: "25" | "50" | "100" | "100+";
  used: boolean;
  expires_at: string;
  created_at?: string;
  updated_at?: string;
}

export const criarTokenCadastroProfessor = async (
  tokenData: Omit<ProfessorRegistrationToken, "id" | "token" | "used" | "created_at" | "updated_at">
): Promise<ProfessorRegistrationToken> => {
  try {
    // Gerar token único
    const token = `prof_reg_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const { data, error } = await supabase
      .from('professor_registration_tokens')
      .insert({
        ...tokenData,
        token,
        used: false,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
      })
      .select()
      .single();

    if (error) throw error;
    return data as ProfessorRegistrationToken;
  } catch (error) {
    console.error("Erro ao criar token de cadastro:", error);
    throw error;
  }
};

export const buscarTokenCadastro = async (token: string): Promise<ProfessorRegistrationToken | null> => {
  try {
    const { data, error } = await supabase
      .from('professor_registration_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? (data as ProfessorRegistrationToken) : null;
  } catch (error) {
    console.error("Erro ao buscar token de cadastro:", error);
    throw error;
  }
};

export const marcarTokenComoUsado = async (token: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('professor_registration_tokens')
      .update({ used: true })
      .eq('token', token);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao marcar token como usado:", error);
    throw error;
  }
};

export const listarTokensAtivos = async (): Promise<ProfessorRegistrationToken[]> => {
  try {
    const { data, error } = await supabase
      .from('professor_registration_tokens')
      .select('*')
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? (data as ProfessorRegistrationToken[]) : [];
  } catch (error) {
    console.error("Erro ao listar tokens ativos:", error);
    throw error;
  }
};
