
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";
import ConversasList from "./ConversasList";
import ChatWindow from "./ChatWindow";
import { Conversa, buscarConversasProfessor } from "@/services/chatService";
import { toast } from "sonner";

const ChatDashboard: React.FC = () => {
  const { user } = useAuth();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      carregarConversas();
    }
  }, [user?.id]);

  const carregarConversas = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const conversasData = await buscarConversasProfessor(user.id);
      setConversas(conversasData);
      
      // Se havia uma conversa selecionada, atualizar seus dados
      if (conversaSelecionada) {
        const conversaAtualizada = conversasData.find(c => c.id === conversaSelecionada.id);
        if (conversaAtualizada) {
          setConversaSelecionada(conversaAtualizada);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
      toast.error("Erro ao carregar conversas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelecionarConversa = (conversa: Conversa) => {
    setConversaSelecionada(conversa);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex">
      <ConversasList
        conversas={conversas}
        conversaSelecionada={conversaSelecionada?.id}
        onSelecionarConversa={handleSelecionarConversa}
        isLoading={isLoading}
      />
      
      {conversaSelecionada ? (
        <ChatWindow conversa={conversaSelecionada} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
            <p>Escolha uma conversa da lista para começar a trocar mensagens</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
