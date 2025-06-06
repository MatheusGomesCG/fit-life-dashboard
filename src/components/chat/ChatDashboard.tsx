
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Plus } from "lucide-react";
import ConversasList from "./ConversasList";
import ChatWindow from "./ChatWindow";
import IniciarConversa from "./IniciarConversa";
import { Conversa, buscarConversasProfessor } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ChatDashboard: React.FC = () => {
  const { user } = useAuth();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarIniciarConversa, setMostrarIniciarConversa] = useState(false);

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
    setMostrarIniciarConversa(false);
  };

  const handleNovaConversa = () => {
    setMostrarIniciarConversa(true);
    setConversaSelecionada(null);
  };

  const handleConversaCriada = (conversa: Conversa) => {
    setConversas(prev => [conversa, ...prev]);
    setConversaSelecionada(conversa);
    setMostrarIniciarConversa(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex">
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Cabeçalho com botão de nova conversa */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-fitness-primary" />
              Conversas
            </h2>
            <Button 
              onClick={handleNovaConversa}
              size="sm"
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Nova
            </Button>
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="flex-1">
          <ConversasList
            conversas={conversas}
            conversaSelecionada={conversaSelecionada?.id}
            onSelecionarConversa={handleSelecionarConversa}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Área principal */}
      {mostrarIniciarConversa ? (
        <IniciarConversa onConversaCriada={handleConversaCriada} />
      ) : conversaSelecionada ? (
        <ChatWindow conversa={conversaSelecionada} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Bem-vindo ao Chat</h3>
            <p className="mb-4">Selecione uma conversa ou inicie uma nova</p>
            <Button 
              onClick={handleNovaConversa}
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Iniciar Nova Conversa
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDashboard;
