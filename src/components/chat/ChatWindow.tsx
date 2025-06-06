
import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Mensagem, 
  Conversa, 
  buscarMensagensConversa, 
  enviarMensagem, 
  marcarMensagensComoLidas 
} from "@/services/chatService";
import { toast } from "sonner";

interface ChatWindowProps {
  conversa: Conversa;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversa }) => {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    carregarMensagens();
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

      setMensagens(prev => [...prev, mensagem]);
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
      return `Hoje, ${format(messageDate, "HH:mm")}`;
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${format(messageDate, "HH:mm")}`;
    } else {
      return format(messageDate, "dd/MM/yyyy, HH:mm");
    }
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
    <div className="flex-1 flex flex-col bg-white">
      {/* Cabeçalho da conversa */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-fitness-primary/20 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-fitness-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{conversa.aluno_nome}</h3>
            <p className="text-sm text-gray-500">{conversa.aluno_email}</p>
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  mensagem.remetente_id === user?.id
                    ? "bg-fitness-primary text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{mensagem.conteudo}</p>
                <p 
                  className={`text-xs mt-1 ${
                    mensagem.remetente_id === user?.id ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {formatarDataMensagem(mensagem.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Campo de input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleEnviarMensagem} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:border-transparent"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            disabled={enviando}
          />
          <button
            type="submit"
            className="p-3 bg-fitness-primary text-white rounded-lg hover:bg-fitness-primary/90 transition-colors disabled:opacity-50"
            disabled={!novaMensagem.trim() || enviando}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
