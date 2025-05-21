
import axios from "axios";
import { Aluno } from "./alunosService";

const API_URL = "https://api.example.com"; // Substitua pela URL real da sua API

export interface Agendamento {
  id: string;
  alunoId: string;
  professorId?: string;
  data: string; // Formato ISO YYYY-MM-DD
  horario: string; // Formato HH:MM
  tipo: "avaliacao" | "consulta" | "treino" | string;
  descricao?: string;
  status: "pendente" | "concluido" | "cancelado";
  aluno?: Aluno;
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

// Mock data para agendamentos
const mockAgendamentos: Record<string, Agendamento[]> = {
  "aluno_01": [
    {
      id: "agd_001",
      alunoId: "aluno_01",
      professorId: "prof_01",
      data: "2025-05-25",
      horario: "10:00",
      tipo: "avaliacao",
      descricao: "Avaliação física mensal",
      status: "pendente"
    },
    {
      id: "agd_002",
      alunoId: "aluno_01",
      professorId: "prof_01",
      data: "2025-04-15",
      horario: "16:30",
      tipo: "consulta",
      descricao: "Ajuste de plano alimentar",
      status: "concluido"
    }
  ],
  "aluno_02": [
    {
      id: "agd_003",
      alunoId: "aluno_02",
      professorId: "prof_01",
      data: "2025-05-18",
      horario: "09:30",
      tipo: "treino",
      descricao: "Acompanhamento de treino de pernas",
      status: "pendente"
    }
  ],
  "aluno_03": [
    {
      id: "agd_004",
      alunoId: "aluno_03",
      professorId: "prof_01",
      data: "2025-05-20",
      horario: "17:00",
      tipo: "avaliacao",
      descricao: "Reavaliação após 3 meses",
      status: "pendente"
    }
  ]
};

// Buscar todos os agendamentos de um aluno
export const buscarAgendamentosPorAluno = async (alunoId: string): Promise<Agendamento[]> => {
  try {
    // Em produção, usar axios para buscar da API real
    // const response = await axios.get(`${API_URL}/agendamentos/aluno/${alunoId}`);
    // return response.data;
    
    // Para desenvolvimento, retornar os dados mockados
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de rede
    
    return mockAgendamentos[alunoId] || [];
  } catch (error) {
    console.error(`Erro ao buscar agendamentos para o aluno ${alunoId}:`, error);
    throw error;
  }
};

// Buscar todos os agendamentos de um professor
export const buscarAgendamentosPorProfessor = async (professorId: string): Promise<Agendamento[]> => {
  try {
    // Em produção, usar axios para buscar da API real
    // const response = await axios.get(`${API_URL}/agendamentos/professor/${professorId}`);
    // return response.data;
    
    // Para desenvolvimento, retornar todos os agendamentos mockados
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de rede
    
    const todosAgendamentos: Agendamento[] = [];
    Object.values(mockAgendamentos).forEach(agendamentos => {
      todosAgendamentos.push(...agendamentos);
    });
    
    return todosAgendamentos.filter(agendamento => agendamento.professorId === professorId);
  } catch (error) {
    console.error(`Erro ao buscar agendamentos para o professor ${professorId}:`, error);
    throw error;
  }
};

// Criar um novo agendamento
export const criarAgendamento = async (agendamento: Omit<Agendamento, "id">): Promise<Agendamento> => {
  try {
    // Em produção, usar axios para enviar à API real
    // const response = await axios.post(`${API_URL}/agendamentos`, agendamento);
    // return response.data;
    
    // Para desenvolvimento, adicionar o novo agendamento aos dados mockados
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay de rede
    
    const novoAgendamento: Agendamento = {
      id: `agd_${Date.now().toString(36)}`,
      professorId: "prof_01", // Definindo um professor padrão para mock
      ...agendamento
    };
    
    if (!mockAgendamentos[agendamento.alunoId]) {
      mockAgendamentos[agendamento.alunoId] = [];
    }
    
    mockAgendamentos[agendamento.alunoId].push(novoAgendamento);
    
    return novoAgendamento;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error;
  }
};

// Atualizar um agendamento existente
export const atualizarAgendamento = async (id: string, agendamento: Partial<Agendamento>): Promise<Agendamento> => {
  try {
    // Em produção, usar axios para enviar à API real
    // const response = await axios.put(`${API_URL}/agendamentos/${id}`, agendamento);
    // return response.data;
    
    // Para desenvolvimento, atualizar o agendamento nos dados mockados
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de rede
    
    let agendamentoAtualizado: Agendamento | null = null;
    
    // Procurar e atualizar o agendamento
    Object.keys(mockAgendamentos).forEach(alunoId => {
      const index = mockAgendamentos[alunoId].findIndex(a => a.id === id);
      
      if (index !== -1) {
        mockAgendamentos[alunoId][index] = {
          ...mockAgendamentos[alunoId][index],
          ...agendamento
        };
        
        agendamentoAtualizado = mockAgendamentos[alunoId][index];
      }
    });
    
    if (!agendamentoAtualizado) {
      throw new Error(`Agendamento com ID ${id} não encontrado`);
    }
    
    return agendamentoAtualizado;
  } catch (error) {
    console.error(`Erro ao atualizar agendamento com ID ${id}:`, error);
    throw error;
  }
};

// Excluir um agendamento
export const excluirAgendamento = async (id: string): Promise<void> => {
  try {
    // Em produção, usar axios para enviar à API real
    // await axios.delete(`${API_URL}/agendamentos/${id}`);
    
    // Para desenvolvimento, remover o agendamento dos dados mockados
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de rede
    
    let encontrado = false;
    
    // Procurar e remover o agendamento
    Object.keys(mockAgendamentos).forEach(alunoId => {
      const index = mockAgendamentos[alunoId].findIndex(a => a.id === id);
      
      if (index !== -1) {
        mockAgendamentos[alunoId].splice(index, 1);
        encontrado = true;
      }
    });
    
    if (!encontrado) {
      throw new Error(`Agendamento com ID ${id} não encontrado`);
    }
  } catch (error) {
    console.error(`Erro ao excluir agendamento com ID ${id}:`, error);
    throw error;
  }
};

// Verificar disponibilidade de horário
export const verificarDisponibilidadeHorario = async (data: string, horario: string): Promise<boolean> => {
  try {
    // Em produção, usar axios para verificar na API real
    // const response = await axios.get(`${API_URL}/agendamentos/disponibilidade?data=${data}&horario=${horario}`);
    // return response.data.disponivel;
    
    // Para desenvolvimento, verificar nos dados mockados
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay de rede
    
    const todosAgendamentos: Agendamento[] = [];
    Object.values(mockAgendamentos).forEach(agendamentos => {
      todosAgendamentos.push(...agendamentos);
    });
    
    // Verificar se já existe algum agendamento nesse horário
    const horarioOcupado = todosAgendamentos.some(
      agendamento => 
        agendamento.data === data && 
        agendamento.horario === horario &&
        agendamento.status !== "cancelado"
    );
    
    return !horarioOcupado;
  } catch (error) {
    console.error(`Erro ao verificar disponibilidade para ${data} às ${horario}:`, error);
    throw error;
  }
};
