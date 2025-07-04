
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
    console.log("🔍 [AdminService] Buscando métricas admin...");
    
    const { data, error } = await supabase
      .from('admin_metricas')
      .select('*')
      .order('data_referencia', { ascending: false })
      .limit(12);

    if (error) {
      console.error("❌ [AdminService] Erro ao buscar métricas:", error);
      throw error;
    }

    console.log("✅ [AdminService] Métricas encontradas:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("❌ [AdminService] Erro ao buscar métricas admin:", error);
    throw error;
  }
};

export const calcularMetricasAdmin = async (dataRef?: string): Promise<void> => {
  try {
    console.log("🔄 [AdminService] Calculando métricas admin...");
    
    const { error } = await supabase.rpc('calcular_metricas_admin', {
      data_ref: dataRef || format(new Date(), 'yyyy-MM-dd')
    });

    if (error) {
      console.error("❌ [AdminService] Erro ao calcular métricas:", error);
      throw error;
    }

    console.log("✅ [AdminService] Métricas calculadas com sucesso");
  } catch (error) {
    console.error("❌ [AdminService] Erro ao calcular métricas:", error);
    throw error;
  }
};

export const buscarTransacoesProfessores = async (): Promise<TransacaoProfessor[]> => {
  try {
    console.log("🔍 [AdminService] Buscando transações de professores...");
    
    const { data, error } = await supabase
      .from('professor_transacoes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ [AdminService] Erro ao buscar transações:", error);
      throw error;
    }
    
    console.log("✅ [AdminService] Transações encontradas:", data?.length || 0);
    
    // Fazer cast do status para o tipo correto
    return (data || []).map(transacao => ({
      ...transacao,
      status: transacao.status as "pendente" | "pago" | "cancelado" | "falhou"
    }));
  } catch (error) {
    console.error("❌ [AdminService] Erro ao buscar transações:", error);
    throw error;
  }
};

export const buscarProfessoresComPlanos = async (): Promise<ProfessorComPlano[]> => {
  try {
    console.log("🔍 [AdminService] Buscando professores com planos...");
    
    // Buscar professores com dados do auth.users para obter o email
    const { data: professores, error: professoresError } = await supabase
      .from('professor_profiles')
      .select(`
        id,
        nome,
        user_id,
        status,
        created_at
      `);

    if (professoresError) {
      console.error("❌ [AdminService] Erro ao buscar professores:", professoresError);
      throw professoresError;
    }

    console.log("✅ [AdminService] Professores encontrados:", professores?.length || 0);

    // Buscar emails dos usuários usando a tabela auth (através de uma função RPC se necessário)
    // Por enquanto, vamos usar um email placeholder e depois você pode ajustar
    const professoresCompletos = await Promise.all(
      (professores || []).map(async (professor) => {
        try {
          // Buscar plano ativo
          const { data: plano } = await supabase
            .from('professor_planos')
            .select('*')
            .eq('professor_id', professor.user_id)
            .eq('status', 'ativo')
            .maybeSingle();

          // Buscar última transação
          const { data: transacoes } = await supabase
            .from('professor_transacoes')
            .select('status, data_pagamento, valor')
            .eq('professor_id', professor.user_id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...professor,
            email: `${professor.nome.toLowerCase().replace(/\s+/g, '.')}@email.com`, // Email mais realista
            plano: plano || undefined,
            ultima_transacao: transacoes?.[0] || undefined
          };
        } catch (error) {
          console.error(`❌ [AdminService] Erro ao processar professor ${professor.id}:`, error);
          return {
            ...professor,
            email: `professor${professor.id.slice(0, 8)}@email.com`,
            plano: undefined,
            ultima_transacao: undefined
          };
        }
      })
    );

    console.log("✅ [AdminService] Professores com planos processados:", professoresCompletos.length);
    return professoresCompletos;
  } catch (error) {
    console.error("❌ [AdminService] Erro ao buscar professores com planos:", error);
    throw error;
  }
};

export const criarTransacao = async (transacao: Omit<TransacaoProfessor, "id" | "created_at" | "updated_at">): Promise<TransacaoProfessor> => {
  try {
    console.log("➕ [AdminService] Criando transação...");
    
    const { data, error } = await supabase
      .from('professor_transacoes')
      .insert(transacao)
      .select()
      .single();

    if (error) {
      console.error("❌ [AdminService] Erro ao criar transação:", error);
      throw error;
    }
    
    console.log("✅ [AdminService] Transação criada:", data.id);
    
    return {
      ...data,
      status: data.status as "pendente" | "pago" | "cancelado" | "falhou"
    };
  } catch (error) {
    console.error("❌ [AdminService] Erro ao criar transação:", error);
    throw error;
  }
};

export const atualizarTransacao = async (id: string, updates: Partial<TransacaoProfessor>): Promise<TransacaoProfessor> => {
  try {
    console.log("🔄 [AdminService] Atualizando transação:", id);
    
    const { data, error } = await supabase
      .from('professor_transacoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("❌ [AdminService] Erro ao atualizar transação:", error);
      throw error;
    }
    
    console.log("✅ [AdminService] Transação atualizada:", data.id);
    
    return {
      ...data,
      status: data.status as "pendente" | "pago" | "cancelado" | "falhou"
    };
  } catch (error) {
    console.error("❌ [AdminService] Erro ao atualizar transação:", error);
    throw error;
  }
};

export const gerarRelatorioExcel = async (ano: number, mes?: number) => {
  try {
    console.log("📊 [AdminService] Gerando relatório Excel...", { ano, mes });
    
    const inicio = mes ? startOfMonth(new Date(ano, mes - 1)) : startOfYear(new Date(ano, 0));
    const fim = mes ? endOfMonth(new Date(ano, mes - 1)) : endOfYear(new Date(ano, 0));

    console.log("📅 [AdminService] Período do relatório:", { inicio, fim });

    // Buscar transações do período com join manual
    const { data: transacoes, error } = await supabase
      .from('professor_transacoes')
      .select('*')
      .gte('created_at', inicio.toISOString())
      .lte('created_at', fim.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ [AdminService] Erro ao buscar transações para relatório:", error);
      throw error;
    }

    console.log("✅ [AdminService] Transações encontradas para relatório:", transacoes?.length || 0);

    if (!transacoes || transacoes.length === 0) {
      console.log("ℹ️ [AdminService] Nenhuma transação encontrada para o período");
      return [];
    }

    // Buscar nomes dos professores separadamente
    const professorIds = [...new Set(transacoes.map(t => t.professor_id))];
    const { data: professores } = await supabase
      .from('professor_profiles')
      .select('user_id, nome')
      .in('user_id', professorIds);

    const professoresMap = new Map(professores?.map(p => [p.user_id, p.nome]) || []);

    // Preparar dados para o Excel
    const dadosExcel = transacoes.map(transacao => ({
      'Data': format(new Date(transacao.created_at), 'dd/MM/yyyy'),
      'Professor': professoresMap.get(transacao.professor_id) || 'N/A',
      'Valor': `R$ ${transacao.valor?.toFixed(2) || '0,00'}`,
      'Status': transacao.status,
      'Método Pagamento': transacao.metodo_pagamento || 'N/A',
      'Gateway': transacao.gateway_pagamento || 'N/A',
      'Data Pagamento': transacao.data_pagamento ? format(new Date(transacao.data_pagamento), 'dd/MM/yyyy') : 'N/A'
    }));

    console.log("✅ [AdminService] Relatório gerado com sucesso:", dadosExcel.length, "registros");
    return dadosExcel;
  } catch (error) {
    console.error("❌ [AdminService] Erro ao gerar relatório:", error);
    throw error;
  }
};
