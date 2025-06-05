
import { supabase } from "@/integrations/supabase/client";

export interface ExercicioTreino {
  id?: string;
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

export interface FichaTreino {
  id: string;
  aluno_id: string;
  professor_id: string;
  exercicios: ExercicioTreino[];
  created_at?: string;
  updated_at?: string;
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

// Listar fichas de treino do professor atual
export const listarFichasTreino = async (): Promise<FichaTreinoCompleta[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from('fichas_treino_completas')
      .select('*')
      .eq('professor_id', userData.user.id);

    if (error) throw error;

    return data?.map(item => ({
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
      exercicios: item.exercicios || [],
      created_at: item.created_at,
      updated_at: item.updated_at
    })) || [];
  } catch (error) {
    console.error("Erro ao listar fichas de treino:", error);
    throw error;
  }
};

// Buscar ficha de treino por aluno
export const buscarFichaTreinoPorAluno = async (alunoId: string): Promise<FichaTreinoCompleta | null> => {
  try {
    const { data, error } = await supabase
      .from('fichas_treino_completas')
      .select('*')
      .eq('aluno_id', alunoId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Nenhuma ficha encontrada
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
      exercicios: data.exercicios || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Erro ao buscar ficha de treino para o aluno ${alunoId}:`, error);
    throw error;
  }
};

// Criar ou atualizar ficha de treino
export const criarOuAtualizarFichaTreino = async (
  alunoId: string, 
  exercicios: Omit<ExercicioTreino, 'id' | 'ficha_treino_id'>[]
): Promise<FichaTreino> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se já existe uma ficha de treino para o aluno
    const { data: fichaExistente } = await supabase
      .from('fichas_treino')
      .select('id')
      .eq('aluno_id', alunoId)
      .eq('professor_id', userData.user.id)
      .single();

    let fichaId: string;

    if (fichaExistente) {
      // Atualizar ficha existente
      fichaId = fichaExistente.id;
      
      // Remover exercícios antigos
      await supabase
        .from('exercicios_treino')
        .delete()
        .eq('ficha_treino_id', fichaId);

      // Atualizar timestamp da ficha
      await supabase
        .from('fichas_treino')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', fichaId);
    } else {
      // Criar nova ficha
      const { data: novaFicha, error: errorFicha } = await supabase
        .from('fichas_treino')
        .insert({
          aluno_id: alunoId,
          professor_id: userData.user.id
        })
        .select('id')
        .single();

      if (errorFicha) throw errorFicha;
      fichaId = novaFicha.id;
    }

    // Inserir novos exercícios
    const exerciciosParaInserir = exercicios.map(exercicio => ({
      ...exercicio,
      ficha_treino_id: fichaId
    }));

    const { error: errorExercicios } = await supabase
      .from('exercicios_treino')
      .insert(exerciciosParaInserir);

    if (errorExercicios) throw errorExercicios;

    // Buscar a ficha completa atualizada
    const fichaCompleta = await buscarFichaTreinoPorAluno(alunoId);
    
    if (!fichaCompleta) {
      throw new Error("Erro ao recuperar ficha de treino criada/atualizada");
    }

    return {
      id: fichaCompleta.ficha_id,
      aluno_id: fichaCompleta.aluno_id,
      professor_id: fichaCompleta.professor_id,
      exercicios: fichaCompleta.exercicios
    };
  } catch (error) {
    console.error("Erro ao criar/atualizar ficha de treino:", error);
    throw error;
  }
};

// Excluir ficha de treino
export const excluirFichaTreino = async (fichaId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('fichas_treino')
      .delete()
      .eq('id', fichaId);

    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir ficha de treino com ID ${fichaId}:`, error);
    throw error;
  }
};

// Verificar se aluno tem ficha de treino
export const alunoTemFichaTreino = async (alunoId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('fichas_treino')
      .select('id')
      .eq('aluno_id', alunoId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error(`Erro ao verificar ficha de treino para o aluno ${alunoId}:`, error);
    return false;
  }
};
