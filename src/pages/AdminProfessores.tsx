
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
import AdminPageHeader from "@/components/admin/AdminPageHeader";

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
        return "text-green-600 bg-green-50 border-green-200";
      case "inativo":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "suspenso":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Gerenciar Professores" 
        description="Visualize e gerencie todos os professores cadastrados"
      >
        <Link to="/admin/cadastrar-professor">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Cadastrar Professor
          </Button>
        </Link>
      </AdminPageHeader>

      {/* Filtros */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou especialidade..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-fit">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px] transition-colors"
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

      {/* Lista de Professores */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="space-y-4">
          {professoresFiltrados.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {professores.length === 0 ? "Nenhum professor cadastrado" : "Nenhum professor encontrado"}
                </h3>
                <p className="text-gray-500 text-center mb-6">
                  {busca || filtroStatus !== "todos" 
                    ? "Tente ajustar os filtros de busca"
                    : "Comece cadastrando o primeiro professor"
                  }
                </p>
                {professores.length === 0 && (
                  <Link to="/admin/cadastrar-professor">
                    <Button size="lg">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Cadastrar Primeiro Professor
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            professoresFiltrados.map((professor) => (
              <Card key={professor.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    {/* Cabeçalho */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-full">
                          <Users className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {professor.nome}
                          </h3>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(professor.status)} mt-2`}>
                            {getStatusIcon(professor.status)}
                            {professor.status.charAt(0).toUpperCase() + professor.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Visualizar</span>
                        </Button>
                        
                        {professor.status === "ativo" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => alterarStatusProfessor(professor.id, "inativo")}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Desativar
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => alterarStatusProfessor(professor.id, "ativo")}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Ativar
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Informações do professor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">Especialidade</span>
                        <p className="text-gray-900">{professor.especialidade || "Não informado"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">Total de Alunos</span>
                        <p className="text-2xl font-bold text-blue-600">{professor.totalAlunos}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-500">Plano Ativo</span>
                        <div className="flex items-center gap-2">
                          {professor.planoAtivo ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-green-600 font-medium">Sim</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-red-600 font-medium">Não</span>
                            </>
                          )}
                        </div>
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
