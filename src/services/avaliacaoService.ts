
import { supabase } from "@/integrations/supabase/client";

export interface DadoAvaliacao {
  grupo_estrategia: string;
  estrategia: string;
  valor: number;
  valor_texto: string;
  unidade: string;
}

export interface AvaliacaoCompleta {
  id: string;
  data_avaliacao: string;
  observacoes: string;
  aluno_nome: string;
  aluno_email: string;
  dados: DadoAvaliacao[];
}

export interface AvaliacaoDetalhada {
  id: string;
  aluno_id: string;
  professor_id: string;
  data_avaliacao: string;
  observacoes: string;
  dados: DadoAvaliacao[];
}

// Buscar avaliação por ID para edição
export const buscarAvaliacaoPorId = async (avaliacaoId: string): Promise<AvaliacaoDetalhada | null> => {
  try {
    const { data: avaliacao, error: avaliacaoError } = await supabase
      .from("avaliacoes_fisicas")
      .select("*")
      .eq("id", avaliacaoId)
      .single();

    if (avaliacaoError) throw avaliacaoError;

    const { data: dados, error: dadosError } = await supabase
      .from("dados_avaliacao")
      .select("*")
      .eq("avaliacao_id", avaliacaoId);

    if (dadosError) throw dadosError;

    const dadosFormatados: DadoAvaliacao[] = dados.map(item => ({
      grupo_estrategia: item.grupo_estrategia,
      estrategia: item.estrategia,
      valor: item.valor || 0,
      valor_texto: item.valor_texto || "",
      unidade: item.unidade || ""
    }));

    return {
      id: avaliacao.id,
      aluno_id: avaliacao.aluno_id,
      professor_id: avaliacao.professor_id,
      data_avaliacao: avaliacao.data_avaliacao,
      observacoes: avaliacao.observacoes || "",
      dados: dadosFormatados
    };
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return null;
  }
};

// Atualizar avaliação existente
export const atualizarAvaliacao = async (
  avaliacaoId: string,
  dataAvaliacao: string,
  observacoes: string,
  dados: { grupo_estrategia: string; estrategia: string; valor?: number; valor_texto?: string; unidade: string }[]
): Promise<void> => {
  try {
    // Atualizar dados básicos da avaliação
    const { error: avaliacaoError } = await supabase
      .from("avaliacoes_fisicas")
      .update({
        data_avaliacao: dataAvaliacao,
        observacoes
      })
      .eq("id", avaliacaoId);

    if (avaliacaoError) throw avaliacaoError;

    // Remover dados antigos
    const { error: deleteError } = await supabase
      .from("dados_avaliacao")
      .delete()
      .eq("avaliacao_id", avaliacaoId);

    if (deleteError) throw deleteError;

    // Inserir novos dados
    if (dados.length > 0) {
      const dadosParaInserir = dados.map(item => ({
        avaliacao_id: avaliacaoId,
        grupo_estrategia: item.grupo_estrategia,
        estrategia: item.estrategia,
        valor: item.unidade === "texto" ? null : item.valor,
        valor_texto: item.unidade === "texto" ? item.valor_texto : null,
        unidade: item.unidade
      }));

      const { error: insertError } = await supabase
        .from("dados_avaliacao")
        .insert(dadosParaInserir);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    throw error;
  }
};

// Excluir avaliação
export const excluirAvaliacao = async (avaliacaoId: string): Promise<void> => {
  try {
    // Primeiro, excluir os dados da avaliação
    const { error: dadosError } = await supabase
      .from("dados_avaliacao")
      .delete()
      .eq("avaliacao_id", avaliacaoId);

    if (dadosError) throw dadosError;

    // Depois, excluir a avaliação
    const { error: avaliacaoError } = await supabase
      .from("avaliacoes_fisicas")
      .delete()
      .eq("id", avaliacaoId);

    if (avaliacaoError) throw avaliacaoError;
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error);
    throw error;
  }
};

// Verificar se usuário pode editar avaliação
export const podeEditarAvaliacao = async (avaliacaoId: string, professorId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("avaliacoes_fisicas")
      .select("professor_id")
      .eq("id", avaliacaoId)
      .eq("professor_id", professorId)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
};
