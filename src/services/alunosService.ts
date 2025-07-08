
import { supabase } from "@/integrations/supabase/client";

export interface Aluno {
  id: string;
  user_id: string;
  professor_id: string;
  nome: string;
  email: string;
  telefone?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  genero?: string;
  objetivo?: string;
  experiencia?: string;
  restricoes_medicas?: string;
  endereco?: string;
  valor_mensalidade?: number;
  data_vencimento?: string;
  observacoes?: string;
  imc?: number;
  percentual_gordura?: number;
  medidas_corporais?: any;
  dobras_cutaneas?: any;
  senha_temporaria?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CargaExercicio {
  nomeExercicio: string;
  grupoMuscular: string;
  cargaIdeal: number;
  series: number;
  repeticoes: number;
  estrategia?: string;
  videoUrl?: string;
  diaTreino: string;
  exercicioCadastradoId?: string;
  equipamento?: string;
  instrucoes?: string;
}

export interface FichaTreino {
  id: string;
  aluno_id: string;
  professor_id: string;
  exercicios: CargaExercicio[];
  created_at: string;
  updated_at: string;
}

export const listarAlunos = async (): Promise<Aluno[]> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    throw error;
  }
};

export const buscarAlunoPorId = async (id: string): Promise<Aluno> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    throw error;
  }
};

export const criarAluno = async (aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>): Promise<Aluno> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .insert(aluno)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    throw error;
  }
};

export const atualizarAluno = async (id: string, aluno: Partial<Aluno>): Promise<Aluno> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .update(aluno)
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    throw error;
  }
};

export const buscarFichaTreinoAluno = async (alunoId: string): Promise<FichaTreino | null> => {
  try {
    const { data: fichaData, error: fichaError } = await supabase
      .from('fichas_treino')
      .select('*')
      .eq('aluno_id', alunoId)
      .single();

    if (fichaError && fichaError.code !== 'PGRST116') throw fichaError;
    if (!fichaData) return null;

    const { data: exerciciosData, error: exerciciosError } = await supabase
      .from('exercicios_treino')
      .select('*')
      .eq('ficha_treino_id', fichaData.id)
      .order('created_at');

    if (exerciciosError) throw exerciciosError;

    const exercicios: CargaExercicio[] = (exerciciosData || []).map(ex => ({
      nomeExercicio: ex.nome_exercicio,
      grupoMuscular: ex.grupo_muscular,
      cargaIdeal: Number(ex.carga_ideal),
      series: ex.series,
      repeticoes: ex.repeticoes,
      estrategia: ex.estrategia || '',
      videoUrl: ex.video_url || '',
      diaTreino: ex.dia_treino,
      exercicioCadastradoId: ex.exercicio_cadastrado_id || '',
      equipamento: ex.equipamento || '',
      instrucoes: ex.instrucoes || ''
    }));

    return {
      ...fichaData,
      exercicios
    };
  } catch (error) {
    console.error('Erro ao buscar ficha de treino:', error);
    throw error;
  }
};

export const criarOuAtualizarFichaTreino = async (alunoId: string, exercicios: CargaExercicio[]): Promise<FichaTreino> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    // Buscar ou criar ficha de treino
    let { data: fichaData, error: fichaError } = await supabase
      .from('fichas_treino')
      .select('*')
      .eq('aluno_id', alunoId)
      .single();

    if (fichaError && fichaError.code === 'PGRST116') {
      // Criar nova ficha
      const { data: novaFicha, error: criarError } = await supabase
        .from('fichas_treino')
        .insert({
          aluno_id: alunoId,
          professor_id: userData.user.id
        })
        .select()
        .single();

      if (criarError) throw criarError;
      fichaData = novaFicha;
    } else if (fichaError) {
      throw fichaError;
    }

    // Deletar exercícios existentes
    await supabase
      .from('exercicios_treino')
      .delete()
      .eq('ficha_treino_id', fichaData.id);

    // Inserir novos exercícios
    const exerciciosParaInserir = exercicios.map(ex => ({
      ficha_treino_id: fichaData.id,
      nome_exercicio: ex.nomeExercicio,
      grupo_muscular: ex.grupoMuscular,
      carga_ideal: ex.cargaIdeal,
      series: ex.series,
      repeticoes: ex.repeticoes,
      estrategia: ex.estrategia || null,
      video_url: ex.videoUrl || null,
      dia_treino: ex.diaTreino,
      exercicio_cadastrado_id: ex.exercicioCadastradoId || null,
      equipamento: ex.equipamento || null,
      instrucoes: ex.instrucoes || null
    }));

    const { error: inserirError } = await supabase
      .from('exercicios_treino')
      .insert(exerciciosParaInserir);

    if (inserirError) throw inserirError;

    return {
      ...fichaData,
      exercicios
    };
  } catch (error) {
    console.error('Erro ao criar/atualizar ficha de treino:', error);
    throw error;
  }
};
