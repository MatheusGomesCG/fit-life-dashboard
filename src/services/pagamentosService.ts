
import { supabase } from "@/integrations/supabase/client";

export interface Pagamento {
  id?: string;
  aluno_id: string;
  aluno_nome: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: "pendente" | "pago" | "atrasado";
  mes: number; // 1-12
  ano: number;
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
    
    return data || [];
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
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
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar pagamento com ID ${id}:`, error);
    throw error;
  }
};

export const cadastrarPagamento = async (pagamento: Omit<Pagamento, "id" | "status">): Promise<Pagamento> => {
  try {
    // Definir status baseado na data de vencimento e data de pagamento
    const status = pagamento.data_pagamento 
      ? "pago" 
      : new Date(pagamento.data_vencimento) < new Date() 
        ? "atrasado" 
        : "pendente";
    
    const { data, error } = await supabase
      .from('pagamentos')
      .insert({
        aluno_id: pagamento.aluno_id,
        aluno_nome: pagamento.aluno_nome,
        valor: pagamento.valor,
        data_vencimento: pagamento.data_vencimento,
        data_pagamento: pagamento.data_pagamento,
        status,
        mes: pagamento.mes,
        ano: pagamento.ano,
        observacao: pagamento.observacao,
        metodo_pagamento: pagamento.metodo_pagamento,
        descricao: pagamento.descricao
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erro ao cadastrar pagamento:", error);
    throw error;
  }
};

export const atualizarPagamento = async (id: string, pagamento: Partial<Pagamento>): Promise<Pagamento> => {
  try {
    // Se a data de pagamento for fornecida, atualizamos o status para "pago"
    let novoStatus = pagamento.status;
    if (pagamento.data_pagamento && !novoStatus) {
      novoStatus = "pago";
    }
    
    const updateData: any = {};
    if (pagamento.aluno_id) updateData.aluno_id = pagamento.aluno_id;
    if (pagamento.aluno_nome) updateData.aluno_nome = pagamento.aluno_nome;
    if (pagamento.valor) updateData.valor = pagamento.valor;
    if (pagamento.data_vencimento) updateData.data_vencimento = pagamento.data_vencimento;
    if (pagamento.data_pagamento) updateData.data_pagamento = pagamento.data_pagamento;
    if (novoStatus) updateData.status = novoStatus;
    if (pagamento.mes) updateData.mes = pagamento.mes;
    if (pagamento.ano) updateData.ano = pagamento.ano;
    if (pagamento.observacao) updateData.observacao = pagamento.observacao;
    if (pagamento.metodo_pagamento) updateData.metodo_pagamento = pagamento.metodo_pagamento;
    if (pagamento.descricao) updateData.descricao = pagamento.descricao;
    if (pagamento.comprovante_url) updateData.comprovante_url = pagamento.comprovante_url;
    
    const { data, error } = await supabase
      .from('pagamentos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar pagamento com ID ${id}:`, error);
    throw error;
  }
};

export const excluirPagamento = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('pagamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir pagamento com ID ${id}:`, error);
    throw error;
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
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('aluno_id', alunoId)
      .order('data_vencimento', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error(`Erro ao buscar pagamentos do aluno ${alunoId}:`, error);
    throw error;
  }
};

// Nova função para enviar comprovante de pagamento
export const enviarComprovantePagamento = async (pagamentoId: string, comprovante: File): Promise<Pagamento> => {
  try {
    // Upload do arquivo para o Supabase Storage
    const fileExt = comprovante.name.split('.').pop();
    const fileName = `${pagamentoId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('comprovantes-pagamento')
      .upload(filePath, comprovante);

    if (uploadError) throw uploadError;

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('comprovantes-pagamento')
      .getPublicUrl(filePath);

    // Atualizar o pagamento com a URL do comprovante
    const pagamentoAtualizado = await atualizarPagamento(pagamentoId, {
      comprovante_url: urlData.publicUrl
    });

    return pagamentoAtualizado;
  } catch (error) {
    console.error("Erro ao enviar comprovante:", error);
    throw error;
  }
};
