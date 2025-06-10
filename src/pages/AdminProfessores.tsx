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

      const { data: professoresData, error } = await supabase
        .from('professor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Para cada professor, buscar o número de alunos e se tem plano ativo
      const professoresComInfo = await Promise.all(
        (professoresData || []).map(async (professor) => {
          // Contar alunos
          const { data: alunos } = await supabase
            .from('aluno_profiles')
            .select('id')
            .eq('professor_id', professor.id);

          // Verificar plano ativo
          const { data: plano } = await supabase
            .from('professor_planos')
            .select('id')
            .eq('professor_id', professor.id)
            .eq('status', 'ativo')
            .maybeSingle();

          return {
            ...professor,
            status: professor.status as "ativo" | "inativo" | "suspenso",
            totalAlunos: alunos?.length || 0,
            planoAtivo: !!plano
          } as Professor;
        })
      );

      setProfessores(professoresComInfo);

    } catch (error) {
      console.error("Erro ao carregar professores:", error);
      toast.error("Erro ao carregar lista de professores");
    } finally {
      setIsLoading(false);
    }
  };

  const alterarStatusProfessor = async (professorId: string, novoStatus: "ativo" | "inativo" | "suspenso") => {
    try {
      const { error } = await supabase
        .from('professor_profiles')
        .update({ status: novoStatus })
        .eq('id', professorId);

      if (error) throw error;

      toast.success(`Status do professor atualizado para ${novoStatus}`);
      carregarProfessores();

    } catch (error) {
      console.error("Erro ao alterar status:", error);
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
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Professores</h1>
            <p className="text-gray-600 mt-1">
              Visualize e gerencie todos os professores cadastrados
            </p>
          </div>
          <Link to="/admin/cadastrar-professor">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Cadastrar Professor
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="grid gap-6">
          {professoresFiltrados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum professor encontrado
                </h3>
                <p className="text-gray-600 text-center">
                  {busca || filtroStatus !== "todos" 
                    ? "Tente ajustar os filtros de busca"
                    : "Comece cadastrando o primeiro professor"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            professoresFiltrados.map((professor) => (
              <Card key={professor.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {professor.nome}
                        </h3>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(professor.status)}`}>
                          {getStatusIcon(professor.status)}
                          {professor.status.charAt(0).toUpperCase() + professor.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Especialidade:</span>
                          <p>{professor.especialidade || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Total de Alunos:</span>
                          <p>{professor.totalAlunos}</p>
                        </div>
                        <div>
                          <span className="font-medium">Plano Ativo:</span>
                          <p className={professor.planoAtivo ? "text-green-600" : "text-red-600"}>
                            {professor.planoAtivo ? "Sim" : "Não"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
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
