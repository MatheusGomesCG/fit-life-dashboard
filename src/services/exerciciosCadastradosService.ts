
import { supabase } from "@/integrations/supabase/client";

export interface ExercicioCadastrado {
  id: string;
  professor_id: string;
  nome: string;
  grupo_muscular: string;
  equipamento?: string;
  instrucoes?: string;
  video_url?: string;
  exercicio_similar_id?: string;
  exercicio_similar?: ExercicioCadastrado;
  created_at: string;
  updated_at: string;
}

export interface TecnicaTreinamento {
  id: string;
  nome: string;
  descricao?: string;
}

export const listarExerciciosCadastrados = async (professorId: string): Promise<ExercicioCadastrado[]> => {
  try {
    const { data, error } = await supabase
      .from('exercicios_cadastrados')
      .select(`
        *,
        exercicio_similar:exercicios_cadastrados!exercicio_similar_id(*)
      `)
      .eq('professor_id', professorId)
      .order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao listar exercícios cadastrados:', error);
    throw error;
  }
};

export const criarExercicioCadastrado = async (exercicio: Omit<ExercicioCadastrado, 'id' | 'created_at' | 'updated_at'>): Promise<ExercicioCadastrado> => {
  try {
    const { data, error } = await supabase
      .from('exercicios_cadastrados')
      .insert(exercicio)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar exercício cadastrado:', error);
    throw error;
  }
};

export const atualizarExercicioCadastrado = async (id: string, exercicio: Partial<ExercicioCadastrado>): Promise<ExercicioCadastrado> => {
  try {
    const { data, error } = await supabase
      .from('exercicios_cadastrados')
      .update(exercicio)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar exercício cadastrado:', error);
    throw error;
  }
};

export const excluirExercicioCadastrado = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('exercicios_cadastrados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao excluir exercício cadastrado:', error);
    throw error;
  }
};

export const listarTecnicasTreinamento = async (): Promise<TecnicaTreinamento[]> => {
  try {
    const { data, error } = await supabase
      .from('tecnicas_treinamento')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao listar técnicas de treinamento:', error);
    throw error;
  }
};
