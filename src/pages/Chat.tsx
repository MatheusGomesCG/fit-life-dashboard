
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Plus, Image, Paperclip, User, Bot } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isImage?: boolean;
  isAI?: boolean;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data para demonstração
  const mockProfessor = {
    id: "prof_01",
    nome: "Professor Silva",
    avatar: "https://placehold.co/200x200?text=PS"
  };

  // Mensagens fictícias para exemplo (incluindo mensagens da IA)
  const mockMessages: Message[] = [
    {
      id: "m1",
      senderId: mockProfessor.id,
      receiverId: user?.id || "",
      content: "Olá! Como posso te ajudar hoje?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: "m2",
      senderId: user?.id || "",
      receiverId: mockProfessor.id,
      content: "Olá professor! Tenho uma dúvida sobre o treino de peito.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString()
    },
    {
      id: "m3",
      senderId: mockProfessor.id,
      receiverId: user?.id || "",
      content: "Ótima pergunta! Para treino de peito, recomendo começar com exercícios compostos como supino reto. Quantos dias por semana você está treinando atualmente?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      isAI: true
    },
    {
      id: "m4",
      senderId: user?.id || "",
      receiverId: mockProfessor.id,
      content: "Estou treinando 3 vezes por semana. É suficiente?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString()
    },
    {
      id: "m5",
      senderId: mockProfessor.id,
      receiverId: user?.id || "",
      content: "Perfeito! 3 vezes por semana é uma frequência excelente para quem está começando. Lembre-se de manter uma boa técnica e progressão gradual no peso. O descanso entre os treinos é fundamental para a recuperação muscular.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isAI: true
    }
  ];

  useEffect(() => {
    // Simulação de carregamento de mensagens
    setLoading(true);
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);

    // Set up real-time subscription for new messages (example)
    const channel = supabase
      .channel('student-chat-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens'
        },
        (payload) => {
          // Handle real-time message updates here
          console.log('Nova mensagem recebida:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: user?.id || "",
      receiverId: mockProfessor.id,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simular resposta da IA após 2-3 segundos
    setTimeout(() => {
      const aiResponses = [
        "Entendi sua dúvida! Vou te ajudar com isso. É importante manter a constância nos treinos e sempre focar na técnica correta.",
        "Excelente pergunta! Para melhorar seus resultados, sugiro manter uma alimentação balanceada junto com os exercícios.",
        "Boa! Continue assim. Lembre-se de sempre se aquecer antes dos exercícios e se alongar após o treino.",
        "Perfeito! Se tiver mais dúvidas sobre exercícios ou nutrição, estou aqui para ajudar. Mantenha o foco nos seus objetivos!"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiResponse: Message = {
        id: `ai${Date.now()}`,
        senderId: mockProfessor.id,
        receiverId: user?.id || "",
        content: randomResponse,
        timestamp: new Date().toISOString(),
        isAI: true
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 2000 + Math.random() * 1000);
  };

  const formatMessageDate = (timestamp: string) => {
    const messageDate = new Date(timestamp);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4 flex items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-fitness-primary/20 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-fitness-primary" />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{mockProfessor.nome}</h2>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        <div className="ml-auto">
          <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Bot className="h-3 w-3 mr-1" />
            IA Ativa
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.senderId === user?.id
                  ? "bg-fitness-primary text-white rounded-tr-none"
                  : message.isAI
                  ? "bg-blue-100 text-blue-900 rounded-tl-none border border-blue-200"
                  : "bg-gray-100 text-gray-900 rounded-tl-none"
              }`}
            >
              {message.isAI && (
                <div className="flex items-center mb-1 text-xs text-blue-600">
                  <Bot className="h-3 w-3 mr-1" />
                  Assistente IA
                </div>
              )}
              {message.isImage ? (
                <img
                  src={message.content}
                  alt="Imagem enviada"
                  className="rounded-md max-h-40 object-contain"
                />
              ) : (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
              <p 
                className={`text-xs mt-1 ${
                  message.senderId === user?.id 
                    ? "text-white/70" 
                    : message.isAI
                    ? "text-blue-600/70"
                    : "text-gray-500"
                }`}
              >
                {formatMessageDate(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            onClick={() => toast.info("Função de anexos em breve!")}
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            onClick={() => toast.info("Função de envio de imagens em breve!")}
          >
            <Image className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            onClick={() => toast.info("Função de anexos em breve!")}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 mx-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-primary focus:border-transparent"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 bg-fitness-primary text-white rounded-full hover:bg-fitness-primary/90 transition-colors"
            disabled={!inputMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <Bot className="h-3 w-3 mr-1" />
          Assistente IA responderá automaticamente quando o professor não estiver disponível
        </p>
      </div>
    </div>
  );
};

export default Chat;
