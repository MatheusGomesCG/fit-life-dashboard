
import { supabase } from "@/integrations/supabase/client";

export interface FeedbackTreino {
  id?: string;
  user_id: string;
  tipo: "geral" | "exercicio";
  mensagem: string;
  exercise_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const enviarFeedback = async (feedback: Omit<FeedbackTreino, "id" | "created_at" | "updated_at">): Promise<FeedbackTreino> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks_treino')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;
    return data as FeedbackTreino;
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
    throw error;
  }
};

export const buscarFeedbacksUsuario = async (userId: string): Promise<FeedbackTreino[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks_treino')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar feedbacks:", error);
    throw error;
  }
};

export const buscarFeedbacksProfessor = async (professorId: string): Promise<FeedbackTreino[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks_treino')
      .select(`
        *,
        aluno_profiles!inner(professor_id, nome)
      `)
      .eq('aluno_profiles.professor_id', professorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar feedbacks do professor:", error);
    throw error;
  }
};
