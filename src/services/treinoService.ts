
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface ExercicioTreino {
  ficha_treino_id: string;
  nome_exercicio: string;
  grupo_muscular: string;
  carga_ideal: number;
  series: number;
  repeticoes: number;
  estrategia?: string;
  video_url?: string;
  dia_treino: string;
}

export interface FichaTreinoCompleta {
  ficha_id: string;
  aluno_id: string;
  professor_id: string;
  aluno_nome: string;
  aluno_email: string;
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  experiencia: string;
  exercicios: ExercicioTreino[];
  created_at: string;
  updated_at: string;
}

// Helper function to safely cast Json to ExercicioTreino[]
const castJsonToExercicios = (jsonData: Json): ExercicioTreino[] => {
  if (Array.isArray(jsonData)) {
    return jsonData as ExercicioTreino[];
  }
  return [];
};

export const buscarTodasFichasTreino = async (): Promise<FichaTreinoCompleta[]> => {
  try {
    const { data, error } = await supabase
      .from('fichas_treino_completas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ficha_id: item.ficha_id,
      aluno_id: item.aluno_id,
      professor_id: item.professor_id,
      aluno_nome: item.aluno_nome,
      aluno_email: item.aluno_email,
      idade: item.idade,
      peso: item.peso,
      altura: item.altura,
      objetivo: item.objetivo,
      experiencia: item.experiencia,
      exercicios: castJsonToExercicios(item.exercicios),
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error("Erro ao buscar fichas de treino:", error);
    throw error;
  }
};

export const buscarFichaTreinoPorId = async (fichaId: string): Promise<FichaTreinoCompleta | null> => {
  try {
    const { data, error } = await supabase
      .from('fichas_treino_completas')
      .select('*')
      .eq('ficha_id', fichaId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return {
      ficha_id: data.ficha_id,
      aluno_id: data.aluno_id,
      professor_id: data.professor_id,
      aluno_nome: data.aluno_nome,
      aluno_email: data.aluno_email,
      idade: data.idade,
      peso: data.peso,
      altura: data.altura,
      objetivo: data.objetivo,
      experiencia: data.experiencia,
      exercicios: castJsonToExercicios(data.exercicios),
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Erro ao buscar ficha de treino por ID:", error);
    throw error;
  }
};
