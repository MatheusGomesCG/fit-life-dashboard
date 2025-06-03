
import { supabase } from "@/integrations/supabase/client";

export interface ProfessorProfile {
  id?: string;
  user_id: string;
  nome: string;
  telefone?: string;
  documento?: string;
  endereco?: string;
  especialidade?: string;
  biografia?: string;
  foto_url?: string;
  status: "ativo" | "inativo" | "suspenso";
  created_at?: string;
  updated_at?: string;
}

export interface ProfessorPlano {
  id?: string;
  professor_id: string;
  tipo_plano: "25" | "50" | "100" | "100+";
  limite_alunos: number;
  preco_mensal: number;
  data_inicio: string;
  data_vencimento: string;
  status: "ativo" | "suspenso" | "cancelado";
  created_at?: string;
  updated_at?: string;
}

export interface AlunoProfile {
  id?: string;
  user_id: string;
  professor_id: string;
  nome: string;
  email: string;
  telefone?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  experiencia?: string;
  objetivo?: string;
  restricoes_medicas?: string;
  senha_temporaria?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const criarPerfilProfessor = async (professorData: Omit<ProfessorProfile, "id" | "created_at" | "updated_at">): Promise<ProfessorProfile> => {
  try {
    const { data, error } = await supabase
      .from('professor_profiles')
      .insert(professorData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar perfil do professor:", error);
    throw error;
  }
};

export const buscarPerfilProfessor = async (userId: string): Promise<ProfessorProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('professor_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error("Erro ao buscar perfil do professor:", error);
    throw error;
  }
};

export const atualizarPerfilProfessor = async (userId: string, updates: Partial<ProfessorProfile>): Promise<ProfessorProfile> => {
  try {
    const { data, error } = await supabase
      .from('professor_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar perfil do professor:", error);
    throw error;
  }
};

export const buscarPlanoProfessor = async (professorId: string): Promise<ProfessorPlano | null> => {
  try {
    const { data, error } = await supabase
      .from('professor_planos')
      .select('*')
      .eq('professor_id', professorId)
      .eq('status', 'ativo')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error("Erro ao buscar plano do professor:", error);
    throw error;
  }
};

export const criarPlanoProfessor = async (planoData: Omit<ProfessorPlano, "id" | "created_at" | "updated_at">): Promise<ProfessorPlano> => {
  try {
    const { data, error } = await supabase
      .from('professor_planos')
      .insert(planoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar plano do professor:", error);
    throw error;
  }
};

export const contarAlunosProfessor = async (professorId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('contar_alunos_professor', { professor_id: professorId });

    if (error) throw error;
    return data || 0;
  } catch (error) {
    console.error("Erro ao contar alunos do professor:", error);
    throw error;
  }
};

export const verificarLimiteAlunos = async (professorId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('verificar_limite_alunos', { professor_id: professorId });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error("Erro ao verificar limite de alunos:", error);
    throw error;
  }
};

export const criarPerfilAluno = async (alunoData: Omit<AlunoProfile, "id" | "created_at" | "updated_at">): Promise<AlunoProfile> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .insert(alunoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar perfil do aluno:", error);
    throw error;
  }
};

export const buscarAlunosProfessor = async (professorId: string): Promise<AlunoProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('aluno_profiles')
      .select('*')
      .eq('professor_id', professorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar alunos do professor:", error);
    throw error;
  }
};
