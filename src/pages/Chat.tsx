
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Send, MessageSquare, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Mensagem {
  id: string;
  texto: string;
  remetente: "usuario" | "professor" | "bot";
  timestamp: Date;
  nome_remetente: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Simular carregamento de mensagens
    setMensagens([
      {
        id: "1",
        texto: "Olá! Como posso ajudá-lo hoje?",
        remetente: "professor",
        timestamp: new Date(Date.now() - 3600000),
        nome_remetente: "Prof. Carlos Silva"
      },
      {
        id: "2", 
        texto: "Oi professor! Tenho uma dúvida sobre o treino de hoje.",
        remetente: "usuario",
        timestamp: new Date(Date.now() - 3000000),
        nome_remetente: user?.nome || "Você"
      },
      {
        id: "3",
        texto: "Claro! Qual é sua dúvida? Posso te ajudar com qualquer exercício.",
        remetente: "professor", 
        timestamp: new Date(Date.now() - 2400000),
        nome_remetente: "Prof. Carlos Silva"
      }
    ]);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      texto: novaMensagem,
      remetente: "usuario",
      timestamp: new Date(),
      nome_remetente: user?.nome || "Você"
    };

    setMensagens(prev => [...prev, mensagem]);
    setNovaMensagem("");

    // Simular resposta automática
    setTimeout(() => {
      const resposta: Mensagem = {
        id: (Date.now() + 1).toString(),
        texto: "Obrigado pela sua mensagem! Vou analisar e responder em breve.",
        remetente: "professor",
        timestamp: new Date(),
        nome_remetente: "Prof. Carlos Silva"
      };
      setMensagens(prev => [...prev, resposta]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat com Professor</h1>
        <p className="text-gray-600 mt-1">
          Converse diretamente com seu professor
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversa com Prof. Carlos Silva
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex gap-3 ${
                  mensagem.remetente === "usuario" ? "justify-end" : "justify-start"
                }`}
              >
                {mensagem.remetente !== "usuario" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {mensagem.remetente === "professor" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    mensagem.remetente === "usuario"
                      ? "bg-fitness-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {mensagem.nome_remetente}
                  </div>
                  <div className="text-sm">{mensagem.texto}</div>
                  <div className={`text-xs mt-1 ${
                    mensagem.remetente === "usuario" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {mensagem.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {mensagem.remetente === "usuario" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de digitação */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1"
              />
              <Button 
                onClick={enviarMensagem}
                disabled={loading || !novaMensagem.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas de uso */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">💡 Dicas para o chat:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Faça perguntas sobre exercícios e técnicas</li>
            <li>• Relate seu progresso e dificuldades</li>
            <li>• Solicite ajustes no seu plano de treino</li>
            <li>• Tire dúvidas sobre alimentação e recuperação</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
