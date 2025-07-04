import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";

interface Professor {
  id: string;
  user_id: string;
  nome: string;
  telefone?: string;
  especialidade?: string;
  status: "ativo" | "inativo" | "suspenso";
  created_at: string;
  totalAlunos?: number;
  planoAtivo?: boolean;
}

const AdminProfessores: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 [AdminProfessores] Carregando professores...");

      const { data: professoresData, error } = await supabase
        .from('professor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("📊 [AdminProfessores] Resultado da consulta:", {
        data: professoresData,
        error,
        count: professoresData?.length || 0
      });

      if (error) {
        console.error("❌ [AdminProfessores] Erro na consulta:", error);
        throw error;
      }

      if (!professoresData || professoresData.length === 0) {
        console.log("⚠️ [AdminProfessores] Nenhum professor encontrado");
        setProfessores([]);
        return;
      }

      const professoresComInfo = await Promise.all(
        professoresData.map(async (professor) => {
          try {
            const { data: alunos, error: alunosError } = await supabase
              .from('aluno_profiles')
              .select('id')
              .eq('professor_id', professor.user_id);

            if (alunosError) {
              console.warn("⚠️ [AdminProfessores] Erro ao buscar alunos para professor", professor.id, alunosError);
            }

            const { data: plano, error: planoError } = await supabase
              .from('professor_planos')
              .select('id')
              .eq('professor_id', professor.user_id)
              .eq('status', 'ativo')
              .maybeSingle();

            if (planoError) {
              console.warn("⚠️ [AdminProfessores] Erro ao buscar plano para professor", professor.id, planoError);
            }

            return {
              ...professor,
              status: professor.status as "ativo" | "inativo" | "suspenso",
              totalAlunos: alunos?.length || 0,
              planoAtivo: !!plano
            } as Professor;
          } catch (error) {
            console.error("❌ [AdminProfessores] Erro ao processar professor", professor.id, error);
            return {
              ...professor,
              status: professor.status as "ativo" | "inativo" | "suspenso",
              totalAlunos: 0,
              planoAtivo: false
            } as Professor;
          }
        })
      );

      console.log("✅ [AdminProfessores] Professores processados:", professoresComInfo.length);
      setProfessores(professoresComInfo);

    } catch (error) {
      console.error("❌ [AdminProfessores] Erro ao carregar professores:", error);
      toast.error("Erro ao carregar lista de professores");
      setProfessores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const alterarStatusProfessor = async (professorId: string, novoStatus: "ativo" | "inativo" | "suspenso") => {
    try {
      console.log("🔄 [AdminProfessores] Alterando status do professor:", { professorId, novoStatus });
      
      const { error } = await supabase
        .from('professor_profiles')
        .update({ status: novoStatus })
        .eq('id', professorId);

      if (error) throw error;

      toast.success(`Status do professor atualizado para ${novoStatus}`);
      await carregarProfessores();

    } catch (error) {
      console.error("❌ [AdminProfessores] Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do professor");
    }
  };

  const professoresFiltrados = professores.filter(professor => {
    const matchBusca = professor.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      professor.especialidade?.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === "todos" || professor.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inativo":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "suspenso":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "text-green-600 bg-green-50";
      case "inativo":
        return "text-gray-600 bg-gray-50";
      case "suspenso":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Professores</h1>
          <p className="text-gray-600 mt-1">
            Visualize e gerencie todos os professores cadastrados
          </p>
        </div>
        <Link to="/admin/cadastrar-professor">
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <UserPlus className="h-4 w-4" />
            Cadastrar Professor
          </Button>
        </Link>
      </div>

      {/* Filtros - Responsivos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou especialidade..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="suspenso">Suspensos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      {!isLoading && (
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Debug: {professores.length} professor(es) carregado(s), {professoresFiltrados.length} após filtros
          </p>
        </div>
      )}

      {/* Lista de Professores - Responsiva */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="space-y-4">
          {professoresFiltrados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {professores.length === 0 ? "Nenhum professor cadastrado" : "Nenhum professor encontrado"}
                </h3>
                <p className="text-gray-600 text-center">
                  {busca || filtroStatus !== "todos" 
                    ? "Tente ajustar os filtros de busca"
                    : "Comece cadastrando o primeiro professor"
                  }
                </p>
                {professores.length === 0 && (
                  <Link to="/admin/cadastrar-professor" className="mt-4">
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Cadastrar Primeiro Professor
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            professoresFiltrados.map((professor) => (
              <Card key={professor.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    {/* Cabeçalho com nome e status */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {professor.nome}
                        </h3>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(professor.status)}`}>
                          {getStatusIcon(professor.status)}
                          {professor.status.charAt(0).toUpperCase() + professor.status.slice(1)}
                        </div>
                      </div>
                      
                      {/* Ações - Botões responsivos */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        
                        {professor.status === "ativo" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => alterarStatusProfessor(professor.id, "inativo")}
                          >
                            Desativar
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => alterarStatusProfessor(professor.id, "ativo")}
                          >
                            Ativar
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Informações do professor - Grid responsivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium block sm:inline">Especialidade:</span>
                        <p className="sm:inline sm:ml-1">{professor.especialidade || "Não informado"}</p>
                      </div>
                      <div>
                        <span className="font-medium block sm:inline">Total de Alunos:</span>
                        <p className="sm:inline sm:ml-1">{professor.totalAlunos}</p>
                      </div>
                      <div>
                        <span className="font-medium block sm:inline">Plano Ativo:</span>
                        <p className={`sm:inline sm:ml-1 ${professor.planoAtivo ? "text-green-600" : "text-red-600"}`}>
                          {professor.planoAtivo ? "Sim" : "Não"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProfessores;
