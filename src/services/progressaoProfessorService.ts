
import { supabase } from "@/integrations/supabase/client";

export interface ProgressaoProfessor {
  id: string;
  aluno_id: string;
  exercise_id: string;
  professor_id: string;
  carga_anterior: number;
  carga_nova: number;
  data_progressao: string;
  observacoes?: string;
  created_at: string;
}

export const criarProgressao = async (progressao: Omit<ProgressaoProfessor, 'id' | 'created_at'>): Promise<ProgressaoProfessor> => {
  try {
    const { data, error } = await supabase
      .from('progressao_professor')
      .insert(progressao)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar progressão:', error);
    throw error;
  }
};

export const buscarProgressaoExercicio = async (alunoId: string, exerciseId: string): Promise<ProgressaoProfessor[]> => {
  try {
    const { data, error } = await supabase
      .from('progressao_professor')
      .select('*')
      .eq('aluno_id', alunoId)
      .eq('exercise_id', exerciseId)
      .order('data_progressao', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar progressão do exercício:', error);
    throw error;
  }
};

export const buscarProgressaoAluno = async (alunoId: string): Promise<ProgressaoProfessor[]> => {
  try {
    const { data, error } = await supabase
      .from('progressao_professor')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_progressao', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar progressão do aluno:', error);
    throw error;
  }
};
