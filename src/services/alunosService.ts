
import { supabase } from "@/integrations/supabase/client";

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  experiencia: string;
  telefone: string;
  restricoes_medicas: string;
  imc?: number;
  percentualGordura?: number;
  // Additional fields for the complete aluno interface
  dataNascimento?: Date | null;
  genero?: "masculino" | "feminino" | "outro";
  endereco?: string;
  observacoes?: string;
  valorMensalidade?: number;
  dataVencimento?: Date | null;
  dobrasCutaneas?: {
    triceps: number;
    subescapular: number;
    axilarMedia: number;
    peitoral: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
  };
  fotos?: FotoAluno[];
}

export interface FotoAluno {
  id: string;
  aluno_id: string;
  url: string;
  data_upload: string;
  data?: string; // Added missing property
  descricao?: string; // Added missing property
  tipo: "frente" | "lado" | "costas";
  observacoes?: string;
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
}

export interface FichaTreino {
  aluno: Aluno;
  exercicios: CargaExercicio[];
  dataAvaliacao?: string;
}

// Calcular IMC
export const calcularIMC = (peso: number, altura: number): number => {
  if (!peso || !altura) return 0;
  const alturaMetros = altura / 100;
  return peso / (alturaMetros * alturaMetros);
};

// Calcular percentual de gordura - Support both old and new function signatures
export const calcularPercentualGordura = (
  dobrasCutaneasOrAluno: {
    triceps: number;
    subescapular: number;
    axilarMedia: number;
    peitoral: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
  } | Aluno,
  genero?: "masculino" | "feminino",
  idade?: number
): number => {
  // Check if it's the old signature with single Aluno parameter
  if (genero === undefined && idade === undefined && 'peso' in dobrasCutaneasOrAluno) {
    // Old signature - return mock value for backwards compatibility
    return 22;
  }
  
  // New signature with dobras cutâneas
  const dobrasCutaneas = dobrasCutaneasOrAluno as {
    triceps: number;
    subescapular: number;
    axilarMedia: number;
    peitoral: number;
    suprailiaca: number;
    abdominal: number;
    coxa: number;
  };
  
  if (!genero || !idade) {
    return 22; // fallback value
  }
  
  // Simplified calculation using Jackson-Pollock formula
  const somaDobras = Object.values(dobrasCutaneas).reduce((sum, dobra) => sum + dobra, 0);
  
  if (genero === "masculino") {
    const densidadeCorporal = 1.112 - (0.00043499 * somaDobras) + (0.00000055 * somaDobras * somaDobras) - (0.00028826 * idade);
    return ((4.95 / densidadeCorporal) - 4.50) * 100;
  } else {
    const densidadeCorporal = 1.097 - (0.00046971 * somaDobras) + (0.00000056 * somaDobras * somaDobras) - (0.00012828 * idade);
    return ((4.96 / densidadeCorporal) - 4.51) * 100;
  }
};

// Listar todos os alunos
export const listarAlunos = async (): Promise<Aluno[]> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    return data.map(aluno => ({
      id: aluno.user_id,
      nome: aluno.nome,
      email: aluno.email,
      idade: aluno.idade,
      peso: aluno.peso,
      altura: aluno.altura,
      objetivo: aluno.objetivo,
      experiencia: aluno.experiencia,
      telefone: aluno.telefone,
      restricoes_medicas: aluno.restricoes_medicas,
      imc: calcularIMC(aluno.peso, aluno.altura),
      percentualGordura: 22
    }));
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    throw error;
  }
};

// Criar um novo aluno (also exported as cadastrarAluno)
export const criarAluno = async (aluno: Omit<Aluno, "id" | "imc" | "percentualGordura">): Promise<Aluno> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: aluno.email,
      password: 'temporaria123',
      options: {
        data: {
          nome: aluno.nome,
          idade: aluno.idade,
          peso: aluno.peso,
          altura: aluno.altura,
          objetivo: aluno.objetivo,
          experiencia: aluno.experiencia,
          telefone: aluno.telefone,
          restricoes_medicas: aluno.restricoes_medicas
        }
      }
    });

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('aluno_profiles')
      .insert({
        user_id: authData.user.id,
        nome: aluno.nome,
        email: aluno.email,
        idade: aluno.idade,
        peso: aluno.peso,
        altura: aluno.altura,
        objetivo: aluno.objetivo,
        experiencia: aluno.experiencia,
        telefone: aluno.telefone,
        restricoes_medicas: aluno.restricoes_medicas,
        professor_id: authData.user.id,
        senha_temporaria: true
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: authData.user.id,
      nome: aluno.nome,
      email: aluno.email,
      idade: aluno.idade,
      peso: aluno.peso,
      altura: aluno.altura,
      objetivo: aluno.objetivo,
      experiencia: aluno.experiencia,
      telefone: aluno.telefone,
      restricoes_medicas: aluno.restricoes_medicas,
      imc: calcularIMC(aluno.peso, aluno.altura),
      percentualGordura: 22
    };
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    throw error;
  }
};

// Export criarAluno as cadastrarAluno for compatibility
export const cadastrarAluno = criarAluno;

// Buscar aluno por ID
export const buscarAlunoPorId = async (id: string): Promise<Aluno | null> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) {
      console.error("Erro ao buscar aluno por ID:", error);
      return null;
    }

    return {
      id: data.user_id,
      nome: data.nome,
      email: data.email,
      idade: data.idade,
      peso: data.peso,
      altura: data.altura,
      objetivo: data.objetivo,
      experiencia: data.experiencia,
      telefone: data.telefone,
      restricoes_medicas: data.restricoes_medicas,
      imc: calcularIMC(data.peso, data.altura),
      percentualGordura: 22,
      fotos: [] // Mock empty photos array
    };
  } catch (error) {
    console.error("Erro ao buscar aluno por ID:", error);
    return null;
  }
};

// Atualizar um aluno existente
export const atualizarAluno = async (id: string, aluno: Partial<Omit<Aluno, "id" | "imc" | "percentualGordura">>): Promise<Aluno | null> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .update({
        nome: aluno.nome,
        email: aluno.email,
        idade: aluno.idade,
        peso: aluno.peso,
        altura: aluno.altura,
        objetivo: aluno.objetivo,
        experiencia: aluno.experiencia,
        telefone: aluno.telefone,
        restricoes_medicas: aluno.restricoes_medicas
      })
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.user_id,
      nome: data.nome,
      email: data.email,
      idade: data.idade,
      peso: data.peso,
      altura: data.altura,
      objetivo: data.objetivo,
      experiencia: data.experiencia,
      telefone: data.telefone,
      restricoes_medicas: aluno.restricoes_medicas,
      imc: calcularIMC(data.peso, data.altura),
      percentualGordura: 22
    };
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    throw error;
  }
};

// Excluir um aluno
export const excluirAluno = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('aluno_profiles')
      .delete()
      .eq('user_id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    throw error;
  }
};

// Photo management functions
export const adicionarFotoAluno = async (alunoId: string, foto: Omit<FotoAluno, "id" | "aluno_id">): Promise<FotoAluno> => {
  // Mock implementation for now
  const novaFoto: FotoAluno = {
    id: Date.now().toString(),
    aluno_id: alunoId,
    url: foto.url,
    data_upload: new Date().toISOString(),
    tipo: foto.tipo,
    observacoes: foto.observacoes
  };
  
  console.log("Foto adicionada:", novaFoto);
  return novaFoto;
};

export const removerFotoAluno = async (fotoId: string): Promise<void> => {
  // Mock implementation for now
  console.log("Foto removida:", fotoId);
};

// Buscar ficha de treino do aluno
export const buscarFichaTreinoAluno = async (alunoId: string): Promise<FichaTreino | null> => {
  try {
    const { data, error } = await supabase
      .from('fichas_treino_completas')
      .select('*')
      .eq('aluno_id', alunoId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Buscar dados do aluno para complementar a resposta
    const aluno = await buscarAlunoPorId(alunoId);

    // Handle the Json type properly
    let exercicios: CargaExercicio[] = [];
    if (data.exercicios && Array.isArray(data.exercicios)) {
      exercicios = data.exercicios.map((ex: any) => ({
        nomeExercicio: ex.nome_exercicio,
        grupoMuscular: ex.grupo_muscular,
        cargaIdeal: ex.carga_ideal,
        series: ex.series,
        repeticoes: ex.repeticoes,
        estrategia: ex.estrategia,
        videoUrl: ex.video_url,
        diaTreino: ex.dia_treino
      }));
    }

    return {
      aluno: aluno!,
      exercicios,
      dataAvaliacao: data.created_at
    };
  } catch (error) {
    console.error(`Erro ao buscar ficha de treino para o aluno ${alunoId}:`, error);
    throw error;
  }
};

// Criar ou atualizar ficha de treino
export const criarOuAtualizarFichaTreino = async (
  alunoId: string, 
  exercicios: CargaExercicio[]
): Promise<void> => {
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
      ficha_treino_id: fichaId,
      nome_exercicio: exercicio.nomeExercicio,
      grupo_muscular: exercicio.grupoMuscular,
      carga_ideal: exercicio.cargaIdeal,
      series: exercicio.series,
      repeticoes: exercicio.repeticoes,
      estrategia: exercicio.estrategia,
      video_url: exercicio.videoUrl,
      dia_treino: exercicio.diaTreino
    }));

    const { error: errorExercicios } = await supabase
      .from('exercicios_treino')
      .insert(exerciciosParaInserir);

    if (errorExercicios) throw errorExercicios;
  } catch (error) {
    console.error("Erro ao criar/atualizar ficha de treino:", error);
    throw error;
  }
};
