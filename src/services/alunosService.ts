
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
  data_nascimento?: string;
  observacoes?: string;
  imc?: number;
  percentual_gordura?: number;
  medidas_corporais?: any;
  dobras_cutaneas?: any;
  senha_temporaria?: boolean;
  created_at: string;
  updated_at: string;
  fotos?: FotoAluno[];
}

export interface FotoAluno {
  id?: string;
  aluno_id: string;
  url: string;
  tipo: "frente" | "lado" | "costas";
  descricao?: string;
  data?: string;
  data_upload: string;
  observacoes?: string;
}

export interface HistoricoMedida {
  id: string;
  aluno_id: string;
  peso?: number;
  altura?: number;
  imc?: number;
  percentual_gordura?: number;
  dobras_cutaneas?: any;
  medidas_corporais?: any;
  data_medicao: string;
  observacoes?: string;
  created_at: string;
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

export const excluirAluno = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('aluno_profiles')
      .delete()
      .eq('user_id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    throw error;
  }
};

// Photo functions
export const adicionarFotoAluno = async (alunoId: string, foto: Omit<FotoAluno, 'id' | 'aluno_id'>): Promise<FotoAluno> => {
  try {
    const novaFoto = {
      ...foto,
      aluno_id: alunoId,
      id: crypto.randomUUID()
    };
    
    // In a real app, this would save to a database
    // For now, we'll just return the photo object
    return novaFoto as FotoAluno;
  } catch (error) {
    console.error('Erro ao adicionar foto:', error);
    throw error;
  }
};

export const removerFotoAluno = async (fotoId: string): Promise<void> => {
  try {
    // In a real app, this would delete from database
    console.log('Removendo foto:', fotoId);
  } catch (error) {
    console.error('Erro ao remover foto:', error);
    throw error;
  }
};

// History functions
export const buscarHistoricoMedidas = async (alunoId: string): Promise<HistoricoMedida[]> => {
  try {
    const { data, error } = await supabase
      .from('historico_medidas')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_medicao', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórico de medidas:', error);
    throw error;
  }
};

export const adicionarMedidaHistorico = async (medida: Omit<HistoricoMedida, 'id' | 'created_at'>): Promise<HistoricoMedida> => {
  try {
    const { data, error } = await supabase
      .from('historico_medidas')
      .insert(medida)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao adicionar medida ao histórico:', error);
    throw error;
  }
};

export const calcularIMC = (peso: number, altura: number): number => {
  const alturaEmMetros = altura / 100;
  return peso / (alturaEmMetros * alturaEmMetros);
};

export const calcularPercentualGordura = (dobras: any, genero: string, idade: number): number => {
  // Simplified calculation - in a real app, you'd use proper formulas
  const somaDobras = Object.values(dobras).reduce((sum: any, dobra: any) => sum + (dobra || 0), 0);
  let percentual = 0;
  
  if (genero === 'masculino') {
    percentual = 1.1125 * (somaDobras as number) - 0.00162 * (somaDobras as number) ** 2 + 0.00205 * idade - 5.401;
  } else {
    percentual = 1.29579 * (somaDobras as number) - 0.00071 * (somaDobras as number) ** 2 + 0.00043 * idade - 2.963;
  }
  
  return Math.max(0, Math.min(50, percentual));
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
