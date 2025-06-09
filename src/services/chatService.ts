
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

// Input sanitization function
const sanitizeContent = (content: string): string => {
  // Remove potentially dangerous HTML/script tags
  const sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  // Limit message length
  return sanitized.substring(0, 1000);
};

// Validate message content
const validateMessageContent = (content: string, tipo: string): boolean => {
  if (!content || content.trim().length === 0) {
    return false;
  }
  
  if (content.length > 1000) {
    return false;
  }
  
  if (tipo && !['texto', 'imagem'].includes(tipo)) {
    return false;
  }
  
  return true;
};

export const buscarConversasProfessor = async (professorId: string): Promise<Conversa[]> => {
  try {
    if (!professorId) {
      throw new Error("Professor ID is required");
    }

    const { data, error } = await supabase
      .from('conversas_completas')
      .select('*')
      .eq('professor_id', professorId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      id: item.id || '',
      professor_id: item.professor_id || '',
      aluno_id: item.aluno_id || '',
      aluno_nome: item.aluno_nome || '',
      aluno_email: item.aluno_email || '',
      ultima_mensagem: item.ultima_mensagem || undefined,
      ultima_mensagem_data: item.ultima_mensagem_data || undefined,
      mensagens_nao_lidas: item.mensagens_nao_lidas || 0,
      created_at: item.created_at || '',
      updated_at: item.updated_at || ''
    }));
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    throw error;
  }
};

export const buscarMensagensConversa = async (conversaId: string): Promise<Mensagem[]> => {
  try {
    if (!conversaId) {
      throw new Error("Conversation ID is required");
    }

    const { data, error } = await supabase
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(item => ({
      id: item.id,
      conversa_id: item.conversa_id,
      remetente_id: item.remetente_id,
      destinatario_id: item.destinatario_id,
      conteudo: item.conteudo,
      created_at: item.created_at,
      lida: item.lida,
      tipo: (item.tipo === 'imagem' ? 'imagem' : 'texto') as 'texto' | 'imagem'
    }));
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    throw error;
  }
};

export const enviarMensagem = async (mensagem: Omit<Mensagem, "id" | "created_at">): Promise<Mensagem> => {
  try {
    // Validate required fields
    if (!mensagem.conversa_id || !mensagem.remetente_id || !mensagem.destinatario_id) {
      throw new Error("Missing required message fields");
    }

    // Validate and sanitize content
    if (!validateMessageContent(mensagem.conteudo, mensagem.tipo)) {
      throw new Error("Invalid message content");
    }

    const sanitizedContent = sanitizeContent(mensagem.conteudo);

    // Verify conversation participants before sending
    const { data: conversa, error: conversaError } = await supabase
      .from('conversas')
      .select('professor_id, aluno_id')
      .eq('id', mensagem.conversa_id)
      .single();

    if (conversaError || !conversa) {
      throw new Error("Conversation not found or access denied");
    }

    // Verify sender is a participant in the conversation
    const isParticipant = conversa.professor_id === mensagem.remetente_id || 
                         conversa.aluno_id === mensagem.remetente_id;
    
    if (!isParticipant) {
      throw new Error("Sender is not a participant in this conversation");
    }

    // Verify recipient is the other participant
    const isValidRecipient = (conversa.professor_id === mensagem.destinatario_id && conversa.aluno_id === mensagem.remetente_id) ||
                            (conversa.aluno_id === mensagem.destinatario_id && conversa.professor_id === mensagem.remetente_id);
    
    if (!isValidRecipient) {
      throw new Error("Invalid recipient for this conversation");
    }

    const { data, error } = await supabase
      .from('mensagens')
      .insert({
        conversa_id: mensagem.conversa_id,
        remetente_id: mensagem.remetente_id,
        destinatario_id: mensagem.destinatario_id,
        conteudo: sanitizedContent,
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
        ultima_mensagem: sanitizedContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', mensagem.conversa_id);

    const novaMensagem = {
      id: data.id,
      conversa_id: data.conversa_id,
      remetente_id: data.remetente_id,
      destinatario_id: data.destinatario_id,
      conteudo: data.conteudo,
      created_at: data.created_at,
      lida: data.lida,
      tipo: (data.tipo === 'imagem' ? 'imagem' : 'texto') as 'texto' | 'imagem'
    };

    // Trigger AI response if message is from student
    const isStudentMessage = conversa.aluno_id === mensagem.remetente_id;
    if (isStudentMessage) {
      // Get student name for context
      const { data: studentData } = await supabase
        .from('aluno_profiles')
        .select('nome')
        .eq('id', conversa.aluno_id)
        .single();

      // Trigger AI response in background
      triggerAIResponse(mensagem.conversa_id, sanitizedContent, studentData?.nome || 'Aluno');
    }

    return novaMensagem;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw error;
  }
};

export const criarOuBuscarConversa = async (professorId: string, alunoId: string): Promise<string> => {
  try {
    if (!professorId || !alunoId) {
      throw new Error("Professor ID and Student ID are required");
    }

    // Verify that the student belongs to the professor
    const { data: studentVerification, error: verificationError } = await supabase
      .rpc('is_student_of_professor', { 
        student_id: alunoId, 
        professor_id: professorId 
      });

    if (verificationError || !studentVerification) {
      throw new Error("Student does not belong to this professor");
    }

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
    if (!conversaId || !usuarioId) {
      throw new Error("Conversation ID and User ID are required");
    }

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

// Function to trigger AI response (runs in background)
const triggerAIResponse = async (conversaId: string, message: string, alunoNome: string) => {
  try {
    // Call the edge function for AI response
    const { data, error } = await supabase.functions.invoke('ai-chat-response', {
      body: {
        message,
        conversaId,
        alunoNome,
        contexto: 'Resposta automática do assistente quando o professor não está disponível.'
      }
    });

    if (error) {
      console.error('Erro ao gerar resposta da IA:', error);
    } else {
      console.log('Resposta da IA gerada com sucesso:', data);
    }
  } catch (error) {
    console.error('Erro ao chamar função de IA:', error);
  }
};
