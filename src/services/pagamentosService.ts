
import { supabase } from "@/integrations/supabase/client";

export interface Pagamento {
  id?: string;
  aluno_id: string;
  aluno_nome: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  mes: number;
  ano: number;
  status: "pendente" | "pago" | "atrasado";
  observacao?: string;
  metodo_pagamento?: string;
  descricao?: string;
  comprovante_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const listarPagamentos = async (): Promise<Pagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .order('data_vencimento', { ascending: false });

    if (error) throw error;
    return data as Pagamento[];
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    throw error;
  }
};

export const buscarPagamentosPorAluno = async (alunoId: string): Promise<Pagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_vencimento', { ascending: false });

    if (error) throw error;
    return data as Pagamento[];
  } catch (error) {
    console.error("Erro ao buscar pagamentos do aluno:", error);
    throw error;
  }
};

export const buscarPagamentoPorId = async (id: string): Promise<Pagamento> => {
  try {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Pagamento;
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    throw error;
  }
};

export const cadastrarPagamento = async (pagamento: Omit<Pagamento, "id" | "created_at" | "updated_at">): Promise<Pagamento> => {
  try {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert({
        aluno_id: pagamento.aluno_id,
        aluno_nome: pagamento.aluno_nome,
        valor: pagamento.valor,
        data_vencimento: pagamento.data_vencimento,
        data_pagamento: pagamento.data_pagamento,
        mes: pagamento.mes,
        ano: pagamento.ano,
        status: pagamento.status || "pendente",
        observacao: pagamento.observacao,
        metodo_pagamento: pagamento.metodo_pagamento,
        descricao: pagamento.descricao
      })
      .select()
      .single();

    if (error) throw error;
    return data as Pagamento;
  } catch (error) {
    console.error("Erro ao cadastrar pagamento:", error);
    throw error;
  }
};

export const atualizarPagamento = async (id: string, updates: Partial<Pagamento>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('pagamentos')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);
    throw error;
  }
};

export const calcularTotalRecebido = (pagamentos: Pagamento[]): number => {
  return pagamentos
    .filter(p => p.status === "pago")
    .reduce((total, p) => total + p.valor, 0);
};

export const calcularTotalPendente = (pagamentos: Pagamento[]): number => {
  return pagamentos
    .filter(p => p.status === "pendente" || p.status === "atrasado")
    .reduce((total, p) => total + p.valor, 0);
};

export const enviarComprovantePagamento = async (pagamentoId: string, arquivo: File): Promise<void> => {
  try {
    // Upload do arquivo para o storage
    const fileExt = arquivo.name.split('.').pop();
    const fileName = `comprovantes/${pagamentoId}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('comprovantes-pagamento')
      .upload(fileName, arquivo);

    if (uploadError) throw uploadError;

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('comprovantes-pagamento')
      .getPublicUrl(fileName);

    // Atualizar o registro de pagamento com a URL do comprovante
    const { error: updateError } = await supabase
      .from('pagamentos')
      .update({
        comprovante_url: urlData.publicUrl,
        status: 'enviado'
      })
      .eq('id', pagamentoId);

    if (updateError) throw updateError;

  } catch (error) {
    console.error("Erro ao enviar comprovante:", error);
    throw error;
  }
};
