
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Calendar, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";

interface PlanoDetalhado {
  id: string;
  professor_id: string;
  professor_nome: string;
  tipo_plano: string;
  limite_alunos: number;
  preco_mensal: number;
  data_inicio: string;
  data_vencimento: string;
  status: string;
  total_alunos: number;
  percentual_uso: number;
}

const AdminPlanosProfessores: React.FC = () => {
  const [planos, setPlanos] = useState<PlanoDetalhado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState({
    totalPlanos: 0,
    planosAtivos: 0,
    receitaTotal: 0,
    planosVencendo: 0
  });

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      setIsLoading(true);

      // Buscar planos com informações dos professores
      const { data: planosData, error } = await supabase
        .from('professor_planos')
        .select(`
          *,
          professor_profiles!inner(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Para cada plano, buscar número de alunos
      const planosDetalhados = await Promise.all(
        (planosData || []).map(async (plano) => {
          const { data: alunos } = await supabase
            .from('aluno_profiles')
            .select('id')
            .eq('professor_id', plano.professor_id);

          const totalAlunos = alunos?.length || 0;
          const percentualUso = plano.limite_alunos === -1 
            ? 0 
            : Math.round((totalAlunos / plano.limite_alunos) * 100);

          return {
            ...plano,
            professor_nome: (plano.professor_profiles as any).nome,
            total_alunos: totalAlunos,
            percentual_uso: percentualUso
          };
        })
      );

      setPlanos(planosDetalhados);

      // Calcular estatísticas
      const totalPlanos = planosDetalhados.length;
      const planosAtivos = planosDetalhados.filter(p => p.status === 'ativo').length;
      const receitaTotal = planosDetalhados
        .filter(p => p.status === 'ativo')
        .reduce((sum, p) => sum + Number(p.preco_mensal), 0);

      // Planos vencendo nos próximos 30 dias
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      const planosVencendo = planosDetalhados.filter(p => 
        p.status === 'ativo' && new Date(p.data_vencimento) <= dataLimite
      ).length;

      setEstatisticas({
        totalPlanos,
        planosAtivos,
        receitaTotal,
        planosVencendo
      });

    } catch (error) {
      console.error("Erro ao carregar planos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ativo":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "suspenso":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "cancelado":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "text-green-600 bg-green-50";
      case "suspenso":
        return "text-amber-600 bg-amber-50";
      case "cancelado":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTipoPlanoLabel = (tipo: string) => {
    switch (tipo) {
      case "25":
        return "Básico (25 alunos)";
      case "50":
        return "Intermediário (50 alunos)";
      case "100":
        return "Avançado (100 alunos)";
      case "100+":
        return "Premium (Ilimitado)";
      default:
        return tipo;
    }
  };

  const isPlanoVencendo = (dataVencimento: string) => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 30);
    return new Date(dataVencimento) <= dataLimite;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Planos dos Professores</h1>
        <p className="text-gray-600 mt-1">
          Visualize e gerencie os planos de todos os professores
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Planos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? <LoadingSpinner size="small" /> : estatisticas.totalPlanos}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planos Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? <LoadingSpinner size="small" /> : estatisticas.planosAtivos}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-purple-600">
                  {isLoading ? <LoadingSpinner size="small" /> : `R$ ${estatisticas.receitaTotal.toFixed(2)}`}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencendo em 30 dias</p>
                <p className="text-2xl font-bold text-amber-600">
                  {isLoading ? <LoadingSpinner size="small" /> : estatisticas.planosVencendo}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Planos */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid gap-6">
          {planos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum plano encontrado
                </h3>
                <p className="text-gray-600 text-center">
                  Não há planos cadastrados no sistema
                </p>
              </CardContent>
            </Card>
          ) : (
            planos.map((plano) => (
              <Card key={plano.id} className={isPlanoVencendo(plano.data_vencimento) ? "border-amber-200 bg-amber-50" : ""}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plano.professor_nome}
                        </h3>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plano.status)}`}>
                          {getStatusIcon(plano.status)}
                          {plano.status.charAt(0).toUpperCase() + plano.status.slice(1)}
                        </div>
                        {isPlanoVencendo(plano.data_vencimento) && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-amber-600 bg-amber-100">
                            <AlertTriangle className="h-3 w-3" />
                            Vencendo
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Plano:</span>
                          <p className="text-gray-900">{getTipoPlanoLabel(plano.tipo_plano)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Preço Mensal:</span>
                          <p className="text-gray-900">R$ {Number(plano.preco_mensal).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Uso:</span>
                          <p className="text-gray-900">
                            {plano.total_alunos} / {plano.limite_alunos === -1 ? "∞" : plano.limite_alunos} alunos
                            {plano.limite_alunos !== -1 && (
                              <span className={`ml-1 text-xs ${plano.percentual_uso > 80 ? 'text-red-600' : 'text-gray-500'}`}>
                                ({plano.percentual_uso}%)
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Vencimento:</span>
                          <p className="text-gray-900">{format(new Date(plano.data_vencimento), "dd/MM/yyyy")}</p>
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

export default AdminPlanosProfessores;
