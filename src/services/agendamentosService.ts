
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Agendamento {
  id: string;
  alunoId: string;
  alunoNome: string;
  tipo: 'avaliacao' | 'consulta' | 'outro';
  data: string;
  hora: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
}

// Mock data for appointments
const AGENDAMENTOS_MOCK: Agendamento[] = [
  {
    id: 'ag001',
    alunoId: 'aluno_01',
    alunoNome: 'João Silva',
    tipo: 'avaliacao',
    data: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    hora: '09:00',
    status: 'agendado',
    observacoes: 'Primeira avaliação física'
  },
  {
    id: 'ag002',
    alunoId: 'aluno_02',
    alunoNome: 'Maria Oliveira',
    tipo: 'avaliacao',
    data: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    hora: '14:30',
    status: 'agendado',
    observacoes: 'Reavaliação mensal'
  },
  {
    id: 'ag003',
    alunoId: 'aluno_03',
    alunoNome: 'Pedro Santos',
    tipo: 'consulta',
    data: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    hora: '10:15',
    status: 'agendado',
    observacoes: 'Dúvidas sobre treino'
  },
  {
    id: 'ag004',
    alunoId: 'aluno_05',
    alunoNome: 'Lucas Ferreira',
    tipo: 'avaliacao',
    data: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
    hora: '16:00',
    status: 'agendado',
    observacoes: 'Avaliação de progresso'
  },
  {
    id: 'ag005',
    alunoId: 'aluno_04',
    alunoNome: 'Ana Costa',
    tipo: 'outro',
    data: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    hora: '11:30',
    status: 'agendado',
    observacoes: 'Ajuste de plano de treino'
  }
];

// Function to get all appointments
export const listarAgendamentos = async (): Promise<Agendamento[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(AGENDAMENTOS_MOCK), 500);
  });
};

// Function to get appointments for this week
export const listarAgendamentosSemana = async (): Promise<Agendamento[]> => {
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje);
  const fimSemana = endOfWeek(hoje);
  
  const agendamentosSemana = AGENDAMENTOS_MOCK.filter(ag => {
    const dataAgendamento = new Date(ag.data);
    return dataAgendamento >= inicioSemana && dataAgendamento <= fimSemana;
  });
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(agendamentosSemana), 500);
  });
};

// Function to create a new appointment
export const criarAgendamento = async (agendamento: Omit<Agendamento, 'id'>): Promise<Agendamento> => {
  const novoAgendamento: Agendamento = {
    ...agendamento,
    id: `ag${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
  };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(novoAgendamento), 500);
  });
};

// Function to update an appointment
export const atualizarAgendamento = async (id: string, dados: Partial<Agendamento>): Promise<Agendamento> => {
  const agendamento = AGENDAMENTOS_MOCK.find(a => a.id === id);
  
  if (!agendamento) {
    throw new Error('Agendamento não encontrado');
  }
  
  const agendamentoAtualizado = { ...agendamento, ...dados };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(agendamentoAtualizado), 500);
  });
};

// Function to delete an appointment
export const excluirAgendamento = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
};

// Function to format date in PT-BR
export const formatarData = (data: string): string => {
  return format(new Date(data), "dd 'de' MMMM", { locale: ptBR });
};

// Function to count assessments for this week
export const contarAvaliacoesSemana = async (): Promise<number> => {
  const agendamentosSemana = await listarAgendamentosSemana();
  return agendamentosSemana.filter(a => a.tipo === 'avaliacao').length;
};
