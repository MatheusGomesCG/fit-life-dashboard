
import React from "react";
import { User, MessageCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Conversa } from "@/services/chatService";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConversasListProps {
  conversas: Conversa[];
  conversaSelecionada?: string;
  onSelecionarConversa: (conversa: Conversa) => void;
  isLoading: boolean;
}

const ConversasList: React.FC<ConversasListProps> = ({
  conversas,
  conversaSelecionada,
  onSelecionarConversa,
  isLoading
}) => {
  const isMobile = useIsMobile();

  const formatarDataUltimaMensagem = (data?: string) => {
    if (!data) return "";
    
    const dataMsg = parseISO(data);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    if (dataMsg.toDateString() === hoje.toDateString()) {
      return format(dataMsg, "HH:mm");
    } else if (dataMsg.toDateString() === ontem.toDateString()) {
      return "Ontem";
    } else {
      return format(dataMsg, "dd/MM");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {!isMobile && (
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-sm font-medium text-gray-900">Conversas</h3>
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho da seção - apenas desktop */}
      {!isMobile && (
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <MessageCircle className="h-4 w-4 mr-2 text-fitness-primary" />
            Conversas
          </h3>
        </div>
      )}
      
      {/* Lista de conversas - ocupa todo o espaço disponível */}
      <div className="flex-1 overflow-y-auto">
        {conversas.length === 0 ? (
          <div className="p-4 text-center text-gray-500 h-full flex flex-col items-center justify-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">Nenhuma conversa ainda</p>
            <p className="text-sm mt-1">As conversas aparecerão quando você receber mensagens dos alunos</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversas.map((conversa) => (
              <div
                key={conversa.id}
                onClick={() => onSelecionarConversa(conversa)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  conversaSelecionada === conversa.id ? "bg-fitness-primary/10" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-fitness-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-fitness-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {conversa.aluno_nome}
                      </h4>
                      {conversa.ultima_mensagem_data && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatarDataUltimaMensagem(conversa.ultima_mensagem_data)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversa.ultima_mensagem || "Nenhuma mensagem ainda"}
                      </p>
                      {conversa.mensagens_nao_lidas > 0 && (
                        <span className="bg-fitness-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                          {conversa.mensagens_nao_lidas}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversasList;
