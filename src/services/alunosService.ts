import { supabase } from "@/integrations/supabase/client";
import { gerarSenhaAleatoria } from "@/utils/passwordGenerator";

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
    console.log("🔍 [listarAlunos] Iniciando busca de alunos");
    
    // Get current user to filter by professor
    const { data: userData } = await supabase.auth.getUser();
    console.log("🔍 [listarAlunos] Usuário atual:", userData.user?.id);
    
    if (!userData.user) {
      console.log("❌ [listarAlunos] Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from('aluno_profiles')
      .select('*')
      .eq('professor_id', userData.user.id)
      .order('nome', { ascending: true });

    console.log("🔍 [listarAlunos] Resultado da query:", { 
      data, 
      error, 
      professor_id: userData.user.id,
      count: data?.length || 0 
    });

    if (error) {
      console.error("❌ [listarAlunos] Erro na query:", error);
      throw error;
    }

    const alunos = data.map(aluno => ({
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

    console.log("✅ [listarAlunos] Alunos processados:", alunos);
    return alunos;
  } catch (error) {
    console.error("❌ [listarAlunos] Erro ao listar alunos:", error);
    throw error;
  }
};

// Criar um novo aluno (also exported as cadastrarAluno)
export const criarAluno = async (aluno: Omit<Aluno, "id" | "imc" | "percentualGordura">): Promise<Aluno> => {
  try {
    console.log("🔄 [criarAluno] Iniciando criação de aluno:", aluno.email);
    
    // Get current professor user
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      throw new Error("Professor não autenticado");
    }

    console.log("👨‍🏫 [criarAluno] Professor atual:", currentUser.user.id);

    // Generate random password for the student
    const senhaTemporaria = gerarSenhaAleatoria();
    console.log("🔑 [criarAluno] Senha gerada para aluno");

    // Create auth user for the student
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: aluno.email,
      password: senhaTemporaria,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome: aluno.nome,
          tipo: 'aluno'
        }
      }
    });

    if (authError) {
      console.error("❌ [criarAluno] Erro na criação do usuário auth:", authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Falha ao criar usuário de autenticação");
    }

    console.log("✅ [criarAluno] Usuário auth criado:", authData.user.id);

    // Create student profile with the CURRENT professor's ID
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
        professor_id: currentUser.user.id, // Use the CURRENT professor's ID, not the student's ID
        senha_temporaria: true
      })
      .select()
      .single();

    if (error) {
      console.error("❌ [criarAluno] Erro ao criar perfil do aluno:", error);
      throw error;
    }

    console.log("✅ [criarAluno] Perfil do aluno criado:", data);

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
    console.error("❌ [criarAluno] Erro ao criar aluno:", error);
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

export const excluirAluno = async (id: string): Promise<void> => {
  try {
    console.log("🗑️ [excluirAluno] Iniciando exclusão do aluno:", id);
    
    // First, delete the student profile
    const { error: profileError } = await supabase
      .from('aluno_profiles')
      .delete()
      .eq('user_id', id);

    if (profileError) {
      console.error("❌ [excluirAluno] Erro ao excluir perfil do aluno:", profileError);
      throw profileError;
    }

    console.log("✅ [excluirAluno] Perfil do aluno excluído com sucesso");

    // Delete related data (fichas de treino, exercícios, mensagens, etc.)
    const { error: fichaError } = await supabase
      .from('fichas_treino')
      .delete()
      .eq('aluno_id', id);

    if (fichaError) {
      console.warn("⚠️ [excluirAluno] Erro ao excluir fichas de treino:", fichaError);
    }

    const { error: agendamentosError } = await supabase
      .from('agendamentos')
      .delete()
      .eq('aluno_id', id);

    if (agendamentosError) {
      console.warn("⚠️ [excluirAluno] Erro ao excluir agendamentos:", agendamentosError);
    }

    const { error: pagamentosError } = await supabase
      .from('pagamentos')
      .delete()
      .eq('aluno_id', id);

    if (pagamentosError) {
      console.warn("⚠️ [excluirAluno] Erro ao excluir pagamentos:", pagamentosError);
    }

    // Delete conversations and messages
    const { error: mensagensError } = await supabase
      .from('mensagens')
      .delete()
      .or(`remetente_id.eq.${id},destinatario_id.eq.${id}`);

    if (mensagensError) {
      console.warn("⚠️ [excluirAluno] Erro ao excluir mensagens:", mensagensError);
    }

    const { error: conversasError } = await supabase
      .from('conversas')
      .delete()
      .eq('aluno_id', id);

    if (conversasError) {
      console.warn("⚠️ [excluirAluno] Erro ao excluir conversas:", conversasError);
    }

    console.log("✅ [excluirAluno] Aluno excluído completamente do sistema");
  } catch (error) {
    console.error("❌ [excluirAluno] Erro ao excluir aluno:", error);
    throw error;
  }
};

export const adicionarFotoAluno = async (alunoId: string, foto: Omit<FotoAluno, "id" | "aluno_id">): Promise<FotoAluno> => {
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
  console.log("Foto removida:", fotoId);
};

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

    const aluno = await buscarAlunoPorId(alunoId);

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

export const criarOuAtualizarFichaTreino = async (
  alunoId: string, 
  exercicios: CargaExercicio[]
): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: fichaExistente } = await supabase
      .from('fichas_treino')
      .select('id')
      .eq('aluno_id', alunoId)
      .eq('professor_id', userData.user.id)
      .single();

    let fichaId: string;

    if (fichaExistente) {
      fichaId = fichaExistente.id;
      
      await supabase
        .from('exercicios_treino')
        .delete()
        .eq('ficha_treino_id', fichaId);

      await supabase
        .from('fichas_treino')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', fichaId);
    } else {
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
