
import React, { useState, useEffect } from "react";
import { User, Search, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { criarOuBuscarConversa, Conversa } from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Aluno {
  id: string;
  user_id: string;
  nome: string;
  email: string;
}

interface IniciarConversaProps {
  onConversaCriada: (conversa: Conversa) => void;
}

const IniciarConversa: React.FC<IniciarConversaProps> = ({ onConversaCriada }) => {
  const { user } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState<Aluno[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [criandoConversa, setCriandoConversa] = useState<string | null>(null);

  useEffect(() => {
    carregarAlunos();
  }, [user?.id]);

  useEffect(() => {
    if (termoBusca.trim() === "") {
      setAlunosFiltrados(alunos);
    } else {
      const filtrados = alunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        aluno.email.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setAlunosFiltrados(filtrados);
    }
  }, [termoBusca, alunos]);

  const carregarAlunos = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('aluno_profiles')
        .select('id, user_id, nome, email')
        .eq('professor_id', user.id)
        .order('nome', { ascending: true });

      if (error) throw error;
      setAlunos(data || []);
      setAlunosFiltrados(data || []);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar alunos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIniciarConversa = async (aluno: Aluno) => {
    if (!user?.id) return;

    try {
      setCriandoConversa(aluno.id);
      const conversaId = await criarOuBuscarConversa(user.id, aluno.user_id);
      
      // Buscar dados da conversa criada
      const { data: conversaData, error } = await supabase
        .from('conversas_completas')
        .select('*')
        .eq('id', conversaId)
        .single();

      if (error) throw error;

      if (conversaData) {
        onConversaCriada(conversaData as Conversa);
        toast.success(`Conversa iniciada com ${aluno.nome}`);
      }
    } catch (error) {
      console.error("Erro ao iniciar conversa:", error);
      toast.error("Erro ao iniciar conversa");
    } finally {
      setCriandoConversa(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">Carregando alunos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Cabeçalho */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nova Conversa</h3>
        <p className="text-sm text-gray-600 mb-4">Selecione um aluno para iniciar uma conversa</p>
        
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar aluno por nome ou email..."
            className="pl-10"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de alunos */}
      <div className="flex-1 overflow-y-auto p-4">
        {alunosFiltrados.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>{termoBusca ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}</p>
            <p className="text-sm">
              {termoBusca ? "Tente ajustar o termo de busca" : "Cadastre alunos para poder conversar com eles"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alunosFiltrados.map((aluno) => (
              <div
                key={aluno.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-fitness-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-fitness-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{aluno.nome}</h4>
                    <p className="text-sm text-gray-600">{aluno.email}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleIniciarConversa(aluno)}
                  disabled={criandoConversa === aluno.id}
                  size="sm"
                  className="bg-fitness-primary hover:bg-fitness-primary/90"
                >
                  {criandoConversa === aluno.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Conversar
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IniciarConversa;
