
import { supabase } from "@/integrations/supabase/client";

export interface Mensagem {
  id: string;
  conversa_id: string;
  remetente_id: string;
  destinatario_id: string;
  conteudo: string;
  created_at: string;
  lida: boolean;
  tipo: 'texto' | 'imagem';
}

export interface Conversa {
  id: string;
  professor_id: string;
  aluno_id: string;
  aluno_nome: string;
  aluno_email: string;
  ultima_mensagem?: string;
  ultima_mensagem_data?: string;
  mensagens_nao_lidas: number;
  created_at: string;
  updated_at: string;
}

export const buscarConversasProfessor = async (professorId: string): Promise<Conversa[]> => {
  try {
    const { data, error } = await supabase
      .from('conversas_completas')
      .select('*')
      .eq('professor_id', professorId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    throw error;
  }
};

export const buscarMensagensConversa = async (conversaId: string): Promise<Mensagem[]> => {
  try {
    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    throw error;
  }
};

export const enviarMensagem = async (mensagem: Omit<Mensagem, "id" | "created_at">): Promise<Mensagem> => {
  try {
    const { data, error } = await supabase
      .from('mensagens')
      .insert({
        conversa_id: mensagem.conversa_id,
        remetente_id: mensagem.remetente_id,
        destinatario_id: mensagem.destinatario_id,
        conteudo: mensagem.conteudo,
        lida: false,
        tipo: mensagem.tipo || 'texto'
      })
      .select()
      .single();

    if (error) throw error;

    // Atualizar a conversa com a última mensagem
    await supabase
      .from('conversas')
      .update({
        ultima_mensagem: mensagem.conteudo,
        updated_at: new Date().toISOString()
      })
      .eq('id', mensagem.conversa_id);

    return data;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
};

export const criarOuBuscarConversa = async (professorId: string, alunoId: string): Promise<string> => {
  try {
    // Primeiro tenta buscar uma conversa existente
    const { data: conversaExistente, error: errorBusca } = await supabase
      .from('conversas')
      .select('id')
      .eq('professor_id', professorId)
      .eq('aluno_id', alunoId)
      .single();

    if (conversaExistente) {
      return conversaExistente.id;
    }

    // Se não existe, cria uma nova conversa
    const { data: novaConversa, error: errorCriacao } = await supabase
      .from('conversas')
      .insert({
        professor_id: professorId,
        aluno_id: alunoId
      })
      .select('id')
      .single();

    if (errorCriacao) throw errorCriacao;
    return novaConversa.id;
  } catch (error) {
    console.error("Erro ao criar/buscar conversa:", error);
    throw error;
  }
};

export const marcarMensagensComoLidas = async (conversaId: string, usuarioId: string): Promise<void> => {
  try {
    await supabase
      .from('mensagens')
      .update({ lida: true })
      .eq('conversa_id', conversaId)
      .eq('destinatario_id', usuarioId)
      .eq('lida', false);
  } catch (error) {
    console.error("Erro ao marcar mensagens como lidas:", error);
    throw error;
  }
};
