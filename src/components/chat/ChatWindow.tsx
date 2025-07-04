
import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle, Bot, Phone, Video, MoreVertical } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Mensagem, 
  Conversa, 
  buscarMensagensConversa, 
  enviarMensagem, 
  marcarMensagensComoLidas 
} from "@/services/chatService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatWindowProps {
  conversa: Conversa;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversa }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarMensagens();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('mensagens-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `conversa_id=eq.${conversa.id}`
        },
        (payload) => {
          const novaMensagem = payload.new as Mensagem;
          setMensagens(prev => [...prev, novaMensagem]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversa.id]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  useEffect(() => {
    // Marcar mensagens como lidas quando a conversa é aberta
    if (user?.id) {
      marcarMensagensComoLidas(conversa.id, user.id);
    }
  }, [conversa.id, user?.id]);

  const carregarMensagens = async () => {
    try {
      setIsLoading(true);
      const mensagensData = await buscarMensagensConversa(conversa.id);
      setMensagens(mensagensData);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !user?.id || enviando) return;

    try {
      setEnviando(true);
      const mensagem = await enviarMensagem({
        conversa_id: conversa.id,
        remetente_id: user.id,
        destinatario_id: conversa.aluno_id,
        conteudo: novaMensagem,
        lida: false,
        tipo: 'texto'
      });

      setNovaMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  };

  const formatarDataMensagem = (timestamp: string) => {
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${isMobile ? 'h-[calc(100vh-140px)]' : 'h-full'} bg-white`}>
      {/* Cabeçalho da conversa - estilo WhatsApp */}
      <div className={`${isMobile ? 'bg-green-600' : 'bg-white border-b border-gray-200'} ${isMobile ? 'text-white' : 'text-gray-900'} ${isMobile ? 'p-3' : 'p-4'} flex items-center justify-between shadow-sm`}>
        <div className="flex items-center flex-1">
          <div className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full ${isMobile ? 'bg-white/20' : 'bg-fitness-primary/20'} flex items-center justify-center mr-3`}>
            <User className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ${isMobile ? 'text-white' : 'text-fitness-primary'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium ${isMobile ? 'text-white text-sm' : 'text-gray-900'} truncate`}>{conversa.aluno_nome}</h3>
            <p className={`text-xs ${isMobile ? 'text-white/80' : 'text-gray-500'} truncate`}>
              {isMobile ? 'online' : conversa.aluno_email}
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
          <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <Bot className="h-3 w-3 mr-1" />
            IA Ativa
          </div>
        )}
      </div>

      {/* Área de mensagens - estilo WhatsApp */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'bg-gray-100 px-3 py-2' : 'bg-white p-4'} space-y-2`}>
        {mensagens.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma mensagem ainda</p>
            <p className="text-sm">Envie a primeira mensagem para iniciar a conversa</p>
          </div>
        ) : (
          mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${
                mensagem.remetente_id === user?.id ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`${isMobile ? 'max-w-[80%]' : 'max-w-[75%]'} ${
                  mensagem.remetente_id === user?.id
                    ? isMobile 
                      ? "bg-green-500 text-white rounded-l-2xl rounded-tr-sm rounded-br-2xl"
                      : "bg-fitness-primary text-white rounded-tr-none rounded-2xl"
                    : isAIMessage(mensagem.conteudo)
                    ? isMobile
                      ? "bg-blue-100 text-blue-900 rounded-r-2xl rounded-tl-sm rounded-bl-2xl border border-blue-200"
                      : "bg-blue-100 text-blue-900 rounded-tl-none rounded-2xl border border-blue-200"
                    : isMobile
                    ? "bg-white text-gray-900 rounded-r-2xl rounded-tl-sm rounded-bl-2xl shadow-sm"
                    : "bg-gray-100 text-gray-900 rounded-tl-none rounded-2xl"
                } ${isMobile ? 'p-2 px-3' : 'p-3'} relative`}
              >
                {isAIMessage(mensagem.conteudo) && (
                  <div className={`flex items-center mb-1 text-xs ${isMobile ? 'text-blue-600' : 'text-blue-600'}`}>
                    <Bot className="h-3 w-3 mr-1" />
                    Assistente IA
                  </div>
                )}
                <p className={`whitespace-pre-wrap break-words ${isMobile ? 'text-sm' : ''}`}>
                  {isAIMessage(mensagem.conteudo) 
                    ? mensagem.conteudo.replace('🤖 ', '') 
                    : mensagem.conteudo
                  }
                </p>
                <p 
                  className={`text-xs mt-1 ${
                    mensagem.remetente_id === user?.id 
                      ? isMobile ? "text-white/70" : "text-white/70"
                      : isAIMessage(mensagem.conteudo)
                      ? "text-blue-600/70"
                      : isMobile ? "text-gray-500" : "text-gray-500"
                  } ${isMobile ? 'text-right' : ''}`}
                >
                  {formatarDataMensagem(mensagem.created_at)}
                </p>
                
                {/* Indicador de leitura estilo WhatsApp (apenas mobile) */}
                {isMobile && mensagem.remetente_id === user?.id && (
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

      {/* Campo de input - estilo WhatsApp */}
      <div className={`${isMobile ? 'bg-gray-100 p-2' : 'bg-white border-t border-gray-200 p-4'}`}>
        <form onSubmit={handleEnviarMensagem} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={isMobile ? "Mensagem" : "Digite sua mensagem..."}
            className={`flex-1 ${isMobile ? 'py-2 px-4 text-sm' : 'p-3'} border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:border-transparent bg-white`}
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            disabled={enviando}
          />
          <button
            type="submit"
            className={`${isMobile ? 'p-2' : 'p-3'} bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 flex-shrink-0`}
            disabled={!novaMensagem.trim() || enviando}
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

export default ChatWindow;
