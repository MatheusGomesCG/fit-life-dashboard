
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export interface AdminMetricas {
  id: string;
  data_referencia: string;
  total_professores_ativos: number;
  total_professores_inativos: number;
  novos_professores_mes: number;
  receita_mensal: number;
  receita_acumulada: number;
  planos_25_ativos: number;
  planos_50_ativos: number;
  planos_100_ativos: number;
  planos_100plus_ativos: number;
  created_at: string;
  updated_at: string;
}

export interface TransacaoProfessor {
  id: string;
  professor_id: string;
  plano_id?: string;
  valor: number;
  moeda: string;
  status: "pendente" | "pago" | "cancelado" | "falhou";
  metodo_pagamento?: string;
  gateway_pagamento?: string;
  gateway_transaction_id?: string;
  data_vencimento?: string;
  data_pagamento?: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessorComPlano {
  id: string;
  nome: string;
  email: string;
  status: string;
  created_at: string;
  plano?: {
    id: string;
    tipo_plano: string;
    limite_alunos: number;
    preco_mensal: number;
    status: string;
    data_vencimento: string;
  };
  ultima_transacao?: {
    status: string;
    data_pagamento?: string;
    valor: number;
  };
}

export const buscarMetricasAdmin = async (): Promise<AdminMetricas[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_metricas')
      .select('*')
      .order('data_referencia', { ascending: false })
      .limit(12);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar métricas admin:", error);
    throw error;
  }
};

export const calcularMetricasAdmin = async (dataRef?: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('calcular_metricas_admin', {
      data_ref: dataRef || format(new Date(), 'yyyy-MM-dd')
    });

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao calcular métricas:", error);
    throw error;
  }
};

export const buscarTransacoesProfessores = async (): Promise<TransacaoProfessor[]> => {
  try {
    const { data, error } = await supabase
      .from('professor_transacoes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw error;
  }
};

export const buscarProfessoresComPlanos = async (): Promise<ProfessorComPlano[]> => {
  try {
    // Buscar professores com seus planos e última transação
    const { data: professores, error: professoresError } = await supabase
      .from('professor_profiles')
      .select(`
        id,
        nome,
        user_id,
        status,
        created_at
      `);

    if (professoresError) throw professoresError;

    // Para cada professor, buscar plano e transações
    const professoresCompletos = await Promise.all(
      (professores || []).map(async (professor) => {
        // Buscar plano ativo
        const { data: plano } = await supabase
          .from('professor_planos')
          .select('*')
          .eq('professor_id', professor.user_id)
          .eq('status', 'ativo')
          .single();

        // Buscar última transação
        const { data: transacoes } = await supabase
          .from('professor_transacoes')
          .select('status, data_pagamento, valor')
          .eq('professor_id', professor.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        return {
          ...professor,
          plano: plano || undefined,
          ultima_transacao: transacoes?.[0] || undefined
        };
      })
    );

    return professoresCompletos;
  } catch (error) {
    console.error("Erro ao buscar professores com planos:", error);
    throw error;
  }
};

export const criarTransacao = async (transacao: Omit<TransacaoProfessor, "id" | "created_at" | "updated_at">): Promise<TransacaoProfessor> => {
  try {
    const { data, error } = await supabase
      .from('professor_transacoes')
      .insert(transacao)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw error;
  }
};

export const atualizarTransacao = async (id: string, updates: Partial<TransacaoProfessor>): Promise<TransacaoProfessor> => {
  try {
    const { data, error } = await supabase
      .from('professor_transacoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw error;
  }
};

export const gerarRelatorioExcel = async (ano: number, mes?: number) => {
  try {
    const inicio = mes ? startOfMonth(new Date(ano, mes - 1)) : startOfYear(new Date(ano, 0));
    const fim = mes ? endOfMonth(new Date(ano, mes - 1)) : endOfYear(new Date(ano, 0));

    // Buscar transações do período
    const { data: transacoes, error } = await supabase
      .from('professor_transacoes')
      .select(`
        *,
        professor_profiles!inner(nome)
      `)
      .gte('created_at', inicio.toISOString())
      .lte('created_at', fim.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Preparar dados para o Excel
    const dadosExcel = (transacoes || []).map(transacao => ({
      'Data': format(new Date(transacao.created_at), 'dd/MM/yyyy'),
      'Professor': transacao.professor_profiles?.nome || 'N/A',
      'Valor': `R$ ${transacao.valor?.toFixed(2) || '0,00'}`,
      'Status': transacao.status,
      'Método Pagamento': transacao.metodo_pagamento || 'N/A',
      'Gateway': transacao.gateway_pagamento || 'N/A',
      'Data Pagamento': transacao.data_pagamento ? format(new Date(transacao.data_pagamento), 'dd/MM/yyyy') : 'N/A'
    }));

    return dadosExcel;
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    throw error;
  }
};
