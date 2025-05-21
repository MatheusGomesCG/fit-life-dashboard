
import axios from "axios";

const API_URL = "https://api.example.com"; // Substitua pela URL real da API

export interface Pagamento {
  id?: string;
  alunoId: string;
  alunoNome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: "pendente" | "pago" | "atrasado";
  mes: number; // 1-12
  ano: number;
  observacao?: string;
  metodoPagamento?: string;
  descricao?: string; // Added the missing property
}

export const listarPagamentos = async (): Promise<Pagamento[]> => {
  try {
    const response = await axios.get(`${API_URL}/pagamentos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    // Para desenvolvimento, retornamos dados mockados
    return dadosMock;
  }
};

export const buscarPagamentoPorId = async (id: string): Promise<Pagamento> => {
  try {
    const response = await axios.get(`${API_URL}/pagamentos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pagamento com ID ${id}:`, error);
    // Para desenvolvimento, retornamos dados mockados
    const pagamento = dadosMock.find(p => p.id === id);
    if (!pagamento) throw new Error("Pagamento não encontrado");
    return pagamento;
  }
};

// Updated to accept string dates
export const cadastrarPagamento = async (pagamento: Omit<Pagamento, "id" | "status">): Promise<Pagamento> => {
  try {
    // Definir status baseado na data de vencimento e data de pagamento
    const status = pagamento.dataPagamento 
      ? "pago" 
      : new Date(pagamento.dataVencimento) < new Date() 
        ? "atrasado" 
        : "pendente";
    
    const novoPagamento = {
      ...pagamento,
      status,
      id: `pag_${Date.now()}`
    };
    
    const response = await axios.post(`${API_URL}/pagamentos`, novoPagamento);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar pagamento:", error);
    // Para desenvolvimento, simulamos o retorno
    return {
      ...pagamento,
      status: pagamento.dataPagamento 
        ? "pago" 
        : new Date(pagamento.dataVencimento) < new Date() 
          ? "atrasado" 
          : "pendente",
      id: `pag_${Date.now()}`
    };
  }
};

export const atualizarPagamento = async (id: string, pagamento: Partial<Pagamento>): Promise<Pagamento> => {
  try {
    // Se a data de pagamento for fornecida, atualizamos o status para "pago"
    let novoStatus = pagamento.status;
    if (pagamento.dataPagamento && !novoStatus) {
      novoStatus = "pago";
    }
    
    const pagamentoAtualizado = {
      ...pagamento,
      status: novoStatus
    };
    
    const response = await axios.put(`${API_URL}/pagamentos/${id}`, pagamentoAtualizado);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar pagamento com ID ${id}:`, error);
    // Para desenvolvimento, simulamos o retorno
    const pagamentoExistente = dadosMock.find(p => p.id === id);
    if (!pagamentoExistente) throw new Error("Pagamento não encontrado");
    
    return {
      ...pagamentoExistente,
      ...pagamento,
      status: pagamento.dataPagamento ? "pago" : pagamento.status || pagamentoExistente.status
    };
  }
};

export const excluirPagamento = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/pagamentos/${id}`);
  } catch (error) {
    console.error(`Erro ao excluir pagamento com ID ${id}:`, error);
    // Para desenvolvimento, simulamos a exclusão
  }
};

export const calcularTotalRecebido = (pagamentos: Pagamento[]): number => {
  return pagamentos
    .filter(p => p.status === "pago")
    .reduce((total, pagamento) => total + pagamento.valor, 0);
};

export const calcularTotalPendente = (pagamentos: Pagamento[]): number => {
  return pagamentos
    .filter(p => p.status === "pendente" || p.status === "atrasado")
    .reduce((total, pagamento) => total + pagamento.valor, 0);
};

export const buscarPagamentosPorAluno = async (alunoId: string): Promise<Pagamento[]> => {
  try {
    const response = await axios.get(`${API_URL}/pagamentos?alunoId=${alunoId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pagamentos do aluno ${alunoId}:`, error);
    // Para desenvolvimento, retornamos dados mockados filtrados
    return dadosMock.filter(p => p.alunoId === alunoId);
  }
};

// Dados mock para desenvolvimento
const dadosMock: Pagamento[] = [
  {
    id: "pag_1",
    alunoId: "1",
    alunoNome: "Carlos Silva",
    valor: 100,
    dataVencimento: "2025-04-10",
    dataPagamento: "2025-04-05",
    status: "pago",
    mes: 4,
    ano: 2025,
    observacao: "Pagamento antecipado",
    metodoPagamento: "Cartão de crédito",
    descricao: "Mensalidade Abril 2025"
  },
  {
    id: "pag_2",
    alunoId: "2",
    alunoNome: "Ana Oliveira",
    valor: 120,
    dataVencimento: "2025-04-15",
    status: "pendente",
    mes: 4,
    ano: 2025,
    metodoPagamento: "Boleto bancário",
    descricao: "Mensalidade Abril 2025"
  },
  {
    id: "pag_3",
    alunoId: "3",
    alunoNome: "Rafael Costa",
    valor: 150,
    dataVencimento: "2025-03-10",
    status: "atrasado",
    mes: 3,
    ano: 2025,
    metodoPagamento: "Pix",
    descricao: "Mensalidade Março 2025"
  },
  {
    id: "pag_4",
    alunoId: "4",
    alunoNome: "Mariana Santos",
    valor: 100,
    dataVencimento: "2025-04-05",
    dataPagamento: "2025-04-01",
    status: "pago",
    mes: 4,
    ano: 2025,
    metodoPagamento: "Transferência bancária",
    descricao: "Mensalidade Abril 2025"
  },
  {
    id: "pag_5",
    alunoId: "5",
    alunoNome: "Bruno Almeida",
    valor: 130,
    dataVencimento: "2025-04-20",
    status: "pendente",
    mes: 4,
    ano: 2025,
    metodoPagamento: "Dinheiro",
    descricao: "Mensalidade Abril 2025"
  }
];
