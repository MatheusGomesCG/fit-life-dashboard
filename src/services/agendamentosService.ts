
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Agendamento {
  id: string;
  aluno_id: string;
  professor_id?: string;
  data: string; // Formato ISO YYYY-MM-DD
  horario: string; // Formato HH:MM
  hora: string; // Alias para horario para compatibilidade
  tipo: "avaliacao" | "consulta" | "treino" | string;
  descricao?: string;
  observacoes?: string;
  status: "pendente" | "concluido" | "cancelado" | "agendado";
  aluno_nome?: string;
  aluno_email?: string;
  aluno_telefone?: string;
}

export const horariosPossiveis = [
  "08:00", "08:30", 
  "09:00", "09:30", 
  "10:00", "10:30", 
  "11:00", "11:30", 
  "14:00", "14:30", 
  "15:00", "15:30", 
  "16:00", "16:30", 
  "17:00", "17:30", 
  "18:00", "18:30",
  "19:00", "19:30"
];

// Formatar data para exibição
export const formatarData = (dataString: string): string => {
  try {
    const data = parseISO(dataString);
    return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dataString;
  }
};

// Listar todos os agendamentos (com dados do aluno)
export const listarAgendamentos = async (): Promise<Agendamento[]> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos_com_aluno')
      .select('*')
      .order('data', { ascending: true })
      .order('horario', { ascending: true });

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      aluno_id: item.aluno_id,
      professor_id: item.professor_id,
      data: item.data,
      horario: item.horario,
      hora: item.horario, // Compatibilidade
      tipo: item.tipo,
      descricao: item.descricao,
      observacoes: item.observacoes,
      status: item.status as "pendente" | "concluido" | "cancelado" | "agendado",
      aluno_nome: item.aluno_nome,
      aluno_email: item.aluno_email,
      aluno_telefone: item.aluno_telefone
    })) || [];
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    throw error;
  }
};

// Listar agendamentos da semana atual
export const listarAgendamentosSemana = async (): Promise<Agendamento[]> => {
  try {
    const hoje = new Date();
    const inicioSemana = startOfWeek(hoje);
    const fimSemana = endOfWeek(hoje);
    
    const { data, error } = await supabase
      .from('agendamentos_com_aluno')
      .select('*')
      .gte('data', format(inicioSemana, 'yyyy-MM-dd'))
      .lte('data', format(fimSemana, 'yyyy-MM-dd'))
      .order('data', { ascending: true })
      .order('horario', { ascending: true });

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      aluno_id: item.aluno_id,
      professor_id: item.professor_id,
      data: item.data,
      horario: item.horario,
      hora: item.horario,
      tipo: item.tipo,
      descricao: item.descricao,
      observacoes: item.observacoes,
      status: item.status as "pendente" | "concluido" | "cancelado" | "agendado",
      aluno_nome: item.aluno_nome,
      aluno_email: item.aluno_email,
      aluno_telefone: item.aluno_telefone
    })) || [];
  } catch (error) {
    console.error("Erro ao listar agendamentos da semana:", error);
    throw error;
  }
};

// Contar avaliações da semana
export const contarAvaliacoesSemana = async (): Promise<number> => {
  try {
    const agendamentosSemana = await listarAgendamentosSemana();
    return agendamentosSemana.filter(
      agendamento => agendamento.tipo === "avaliacao" && agendamento.status !== "cancelado"
    ).length;
  } catch (error) {
    console.error("Erro ao contar avaliações da semana:", error);
    throw error;
  }
};

// Buscar todos os agendamentos de um aluno
export const buscarAgendamentosPorAluno = async (alunoId: string): Promise<Agendamento[]> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos_com_aluno')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data', { ascending: false })
      .order('horario', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      aluno_id: item.aluno_id,
      professor_id: item.professor_id,
      data: item.data,
      horario: item.horario,
      hora: item.horario,
      tipo: item.tipo,
      descricao: item.descricao,
      observacoes: item.observacoes,
      status: item.status as "pendente" | "concluido" | "cancelado" | "agendado",
      aluno_nome: item.aluno_nome,
      aluno_email: item.aluno_email,
      aluno_telefone: item.aluno_telefone
    })) || [];
  } catch (error) {
    console.error(`Erro ao buscar agendamentos para o aluno ${alunoId}:`, error);
    throw error;
  }
};

// Buscar todos os agendamentos de um professor
export const buscarAgendamentosPorProfessor = async (professorId: string): Promise<Agendamento[]> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos_com_aluno')
      .select('*')
      .eq('professor_id', professorId)
      .order('data', { ascending: true })
      .order('horario', { ascending: true });

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      aluno_id: item.aluno_id,
      professor_id: item.professor_id,
      data: item.data,
      horario: item.horario,
      hora: item.horario,
      tipo: item.tipo,
      descricao: item.descricao,
      observacoes: item.observacoes,
      status: item.status as "pendente" | "concluido" | "cancelado" | "agendado",
      aluno_nome: item.aluno_nome,
      aluno_email: item.aluno_email,
      aluno_telefone: item.aluno_telefone
    })) || [];
  } catch (error) {
    console.error(`Erro ao buscar agendamentos para o professor ${professorId}:`, error);
    throw error;
  }
};

// Criar um novo agendamento
export const criarAgendamento = async (agendamento: Omit<Agendamento, "id">): Promise<Agendamento> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        aluno_id: agendamento.aluno_id,
        professor_id: userData.user.id,
        data: agendamento.data,
        horario: agendamento.horario,
        tipo: agendamento.tipo,
        descricao: agendamento.descricao,
        observacoes: agendamento.observacoes,
        status: agendamento.status || 'pendente'
      })
      .select()
      .single();

    if (error) throw error;

    // Buscar os dados completos com informações do aluno
    const agendamentoCompleto = await buscarAgendamentosPorProfessor(userData.user.id);
    const novoAgendamento = agendamentoCompleto.find(a => a.id === data.id);

    if (!novoAgendamento) {
      throw new Error("Erro ao recuperar agendamento criado");
    }

    return novoAgendamento;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error;
  }
};

// Atualizar um agendamento existente
export const atualizarAgendamento = async (id: string, agendamento: Partial<Agendamento>): Promise<Agendamento> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .update({
        data: agendamento.data,
        horario: agendamento.horario,
        tipo: agendamento.tipo,
        descricao: agendamento.descricao,
        observacoes: agendamento.observacoes,
        status: agendamento.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Buscar dados completos com informações do aluno
    const { data: agendamentoCompleto, error: fetchError } = await supabase
      .from('agendamentos_com_aluno')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    return {
      id: agendamentoCompleto.id,
      aluno_id: agendamentoCompleto.aluno_id,
      professor_id: agendamentoCompleto.professor_id,
      data: agendamentoCompleto.data,
      horario: agendamentoCompleto.horario,
      hora: agendamentoCompleto.horario,
      tipo: agendamentoCompleto.tipo,
      descricao: agendamentoCompleto.descricao,
      observacoes: agendamentoCompleto.observacoes,
      status: agendamentoCompleto.status as "pendente" | "concluido" | "cancelado" | "agendado",
      aluno_nome: agendamentoCompleto.aluno_nome,
      aluno_email: agendamentoCompleto.aluno_email,
      aluno_telefone: agendamentoCompleto.aluno_telefone
    };
  } catch (error) {
    console.error(`Erro ao atualizar agendamento com ID ${id}:`, error);
    throw error;
  }
};

// Excluir um agendamento
export const excluirAgendamento = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir agendamento com ID ${id}:`, error);
    throw error;
  }
};

// Verificar disponibilidade de horário
export const verificarDisponibilidadeHorario = async (data: string, horario: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('professor_id', userData.user.id)
      .eq('data', data)
      .eq('horario', horario)
      .neq('status', 'cancelado');

    if (error) throw error;

    return agendamentos.length === 0;
  } catch (error) {
    console.error(`Erro ao verificar disponibilidade para ${data} às ${horario}:`, error);
    throw error;
  }
};
