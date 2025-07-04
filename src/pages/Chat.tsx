
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Send, User, Bot, Phone, Video, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Mensagem, 
  Conversa, 
  buscarMensagensConversa, 
  enviarMensagem, 
  marcarMensagensComoLidas,
  criarOuBuscarConversa 
} from "@/services/chatService";

const Chat: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [conversa, setConversa] = useState<Conversa | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      inicializarChat();
    }
  }, [user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversa?.id) return;

    console.log('🔔 Configurando realtime para conversa:', conversa.id);
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`mensagens-${conversa.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `conversa_id=eq.${conversa.id}`
        },
        (payload) => {
          console.log('📨 Nova mensagem recebida via realtime:', payload);
          const novaMensagem = payload.new as Mensagem;
          setMessages(prev => {
            // Evitar duplicatas
            const exists = prev.some(msg => msg.id === novaMensagem.id);
            if (exists) return prev;
            return [...prev, novaMensagem];
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do canal realtime:', status);
      });

    return () => {
      console.log('🔌 Removendo canal realtime');
      supabase.removeChannel(channel);
    };
  }, [conversa?.id]);

  useEffect(() => {
    if (conversa?.id && user?.id) {
      marcarMensagensComoLidas(conversa.id, user.id);
    }
  }, [messages, conversa?.id, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const inicializarChat = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) return;

      console.log('🚀 Inicializando chat para aluno:', user.id);

      // Buscar dados do aluno para pegar o professor_id
      const { data: alunoData, error: alunoError } = await supabase
        .from('aluno_profiles')
        .select('professor_id')
        .eq('user_id', user.id)
        .single();

      if (alunoError || !alunoData?.professor_id) {
        console.error('❌ Erro ao buscar dados do aluno:', alunoError);
        toast.error("Erro ao buscar dados do aluno");
        return;
      }

      console.log('👨‍🏫 Professor encontrado:', alunoData.professor_id);

      // Criar ou buscar conversa existente
      const conversaId = await criarOuBuscarConversa(alunoData.professor_id, user.id);
      console.log('💬 Conversa ID:', conversaId);
      
      // Buscar dados completos da conversa
      const { data: conversaData, error: conversaError } = await supabase
        .from('conversas_completas')
        .select('*')
        .eq('id', conversaId)
        .single();

      if (conversaError || !conversaData) {
        console.error('❌ Erro ao carregar conversa:', conversaError);
        toast.error("Erro ao carregar conversa");
        return;
      }

      const conversaCompleta: Conversa = {
        id: conversaData.id,
        professor_id: conversaData.professor_id,
        aluno_id: conversaData.aluno_id,
        aluno_nome: conversaData.aluno_nome || '',
        aluno_email: conversaData.aluno_email || '',
        ultima_mensagem: conversaData.ultima_mensagem,
        ultima_mensagem_data: conversaData.ultima_mensagem_data,
        mensagens_nao_lidas: conversaData.mensagens_nao_lidas || 0,
        created_at: conversaData.created_at,
        updated_at: conversaData.updated_at
      };

      setConversa(conversaCompleta);

      // Carregar mensagens
      const mensagensData = await buscarMensagensConversa(conversaId);
      console.log('📨 Mensagens carregadas:', mensagensData.length);
      setMessages(mensagensData);

    } catch (error) {
      console.error("❌ Erro ao inicializar chat:", error);
      toast.error("Erro ao carregar chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user?.id || !conversa || enviando) return;

    const mensagemTexto = inputMessage.trim();
    console.log('📤 Enviando mensagem:', mensagemTexto);

    // Criar mensagem otimista antes do try/catch
    const mensagemOtimista: Mensagem = {
      id: 'temp-' + Date.now(),
      conversa_id: conversa.id,
      remetente_id: user.id,
      destinatario_id: conversa.professor_id,
      conteudo: mensagemTexto,
      lida: false,
      tipo: 'texto',
      created_at: new Date().toISOString()
    };

    try {
      setEnviando(true);
      
      // Adicionar mensagem otimisticamente
      setMessages(prev => [...prev, mensagemOtimista]);
      setInputMessage("");

      const novaMensagem = await enviarMensagem({
        conversa_id: conversa.id,
        remetente_id: user.id,
        destinatario_id: conversa.professor_id,
        conteudo: mensagemTexto,
        lida: false,
        tipo: 'texto'
      });

      console.log('✅ Mensagem enviada com sucesso:', novaMensagem);

      // Remover mensagem otimista e adicionar a real
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== mensagemOtimista.id);
        const exists = filtered.some(msg => msg.id === novaMensagem.id);
        if (exists) return filtered;
        return [...filtered, novaMensagem];
      });

    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
      // Remover mensagem otimista em caso de erro
      setMessages(prev => prev.filter(msg => msg.id !== mensagemOtimista.id));
    } finally {
      setEnviando(false);
    }
  };

  const formatMessageDate = (timestamp: string) => {
    const messageDate = parseISO(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "HH:mm");
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Ontem ${format(messageDate, "HH:mm")}`;
    } else {
      return format(messageDate, "dd/MM HH:mm");
    }
  };

  const isAIMessage = (conteudo: string) => {
    return conteudo.startsWith('🤖');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!conversa) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Erro ao carregar conversa</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-200px)]'} bg-white ${isMobile ? '' : 'rounded-lg shadow-sm border border-gray-200'}`}>
      {/* Cabeçalho estilo WhatsApp */}
      <div className={`${isMobile ? 'bg-green-600 text-white p-3' : 'border-b border-gray-200 p-4'} flex items-center justify-between shadow-sm`}>
        <div className="flex items-center flex-1">
          <div className={`${isMobile ? 'h-8 w-8 bg-white/20' : 'h-10 w-10 bg-fitness-primary/20'} rounded-full flex items-center justify-center mr-3`}>
            <User className={`${isMobile ? 'h-4 w-4 text-white' : 'h-5 w-5 text-fitness-primary'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`font-medium ${isMobile ? 'text-white text-sm' : 'text-gray-900'} truncate`}>
              {isMobile ? 'Professor' : 'Seu Professor'}
            </h2>
            <p className={`text-xs ${isMobile ? 'text-white/80' : 'text-green-600'} truncate`}>
              {isMobile ? 'online' : 'Chat com IA ativa'}
            </p>
          </div>
        </div>
        
        {isMobile ? (
          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5 text-white" />
            <Video className="h-5 w-5 text-white" />
            <MoreVertical className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Bot className="h-3 w-3 mr-1" />
            IA Ativa
          </div>
        )}
      </div>

      {/* Área de mensagens estilo WhatsApp */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'bg-gray-100 px-3 py-2' : 'bg-white p-4'} space-y-2`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Nenhuma mensagem ainda</p>
            <p className="text-sm">Envie a primeira mensagem para seu professor</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.remetente_id === user?.id ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`${isMobile ? 'max-w-[80%]' : 'max-w-[75%]'} ${
                  message.remetente_id === user?.id
                    ? isMobile 
                      ? "bg-green-500 text-white rounded-l-2xl rounded-tr-sm rounded-br-2xl"
                      : "bg-fitness-primary text-white rounded-tr-none rounded-2xl"
                    : isAIMessage(message.conteudo)
                    ? isMobile
                      ? "bg-blue-100 text-blue-900 rounded-r-2xl rounded-tl-sm rounded-bl-2xl border border-blue-200"
                      : "bg-blue-100 text-blue-900 rounded-tl-none rounded-2xl border border-blue-200"
                    : isMobile
                    ? "bg-white text-gray-900 rounded-r-2xl rounded-tl-sm rounded-bl-2xl shadow-sm"
                    : "bg-gray-100 text-gray-900 rounded-tl-none rounded-2xl"
                } ${isMobile ? 'p-2 px-3' : 'p-3'} relative`}
              >
                {isAIMessage(message.conteudo) && (
                  <div className={`flex items-center mb-1 text-xs ${isMobile ? 'text-blue-600' : 'text-blue-600'}`}>
                    <Bot className="h-3 w-3 mr-1" />
                    Assistente IA
                  </div>
                )}
                <p className={`whitespace-pre-wrap break-words ${isMobile ? 'text-sm' : ''}`}>
                  {isAIMessage(message.conteudo) 
                    ? message.conteudo.replace('🤖 ', '') 
                    : message.conteudo
                  }
                </p>
                <p 
                  className={`text-xs mt-1 ${
                    message.remetente_id === user?.id 
                      ? isMobile ? "text-white/70" : "text-white/70"
                      : isAIMessage(message.conteudo)
                      ? "text-blue-600/70"
                      : isMobile ? "text-gray-500" : "text-gray-500"
                  } ${isMobile ? 'text-right' : ''}`}
                >
                  {formatMessageDate(message.created_at)}
                </p>
                
                {/* Indicador de leitura estilo WhatsApp (apenas mobile) */}
                {isMobile && message.remetente_id === user?.id && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className="text-white/70 text-xs">✓✓</div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Campo de input estilo WhatsApp */}
      <div className={`${isMobile ? 'bg-gray-100 p-2' : 'bg-white border-t border-gray-200 p-4'}`}>
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={isMobile ? "Mensagem" : "Digite sua mensagem..."}
            className={`flex-1 ${isMobile ? 'py-2 px-4 text-sm' : 'p-3'} border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:border-transparent bg-white`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={enviando}
          />
          <button
            type="submit"
            className={`${isMobile ? 'p-2' : 'p-3'} bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 flex-shrink-0`}
            disabled={!inputMessage.trim() || enviando}
          >
            <Send className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </button>
        </form>
        {!isMobile && (
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <Bot className="h-3 w-3 mr-1" />
            Assistente IA responderá automaticamente quando o professor não estiver disponível
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;
