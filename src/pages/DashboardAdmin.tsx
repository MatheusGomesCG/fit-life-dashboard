
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  TrendingUp,
  ChevronRight,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProfessorStats {
  total: number;
  ativos: number;
  inativos: number;
  comPlano: number;
}

const DashboardAdmin: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfessorStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    comPlano: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setIsLoading(true);

      // Buscar total de professores
      const { data: professores, error: professoresError } = await supabase
        .from('professor_profiles')
        .select('status');

      if (professoresError) throw professoresError;

      // Buscar professores com planos ativos
      const { data: planos, error: planosError } = await supabase
        .from('professor_planos')
        .select('professor_id')
        .eq('status', 'ativo');

      if (planosError) throw planosError;

      const total = professores?.length || 0;
      const ativos = professores?.filter(p => p.status === 'ativo').length || 0;
      const inativos = professores?.filter(p => p.status === 'inativo').length || 0;
      const comPlano = planos?.length || 0;

      setStats({
        total,
        ativos,
        inativos,
        comPlano
      });

    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao painel de administração, {user?.nome || "Admin"}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Professores</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? <LoadingSpinner size="small" /> : stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Professores Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? <LoadingSpinner size="small" /> : stats.ativos}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Professores Inativos</p>
              <p className="text-2xl font-bold text-amber-600">
                {isLoading ? <LoadingSpinner size="small" /> : stats.inativos}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Com Planos Ativos</p>
              <p className="text-2xl font-bold text-purple-600">
                {isLoading ? <LoadingSpinner size="small" /> : stats.comPlano}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/professores"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-blue-50 rounded-full w-fit">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Gerenciar Professores</h2>
          <p className="text-gray-600 mt-2">
            Visualizar, editar e gerenciar todos os professores cadastrados
          </p>
          <div className="mt-4 flex items-center text-blue-500">
            <span className="text-sm font-medium">Acessar</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/cadastrar-professor"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-green-50 rounded-full w-fit">
            <UserPlus className="h-6 w-6 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Cadastrar Professor</h2>
          <p className="text-gray-600 mt-2">
            Registrar novos professores no sistema
          </p>
          <div className="mt-4 flex items-center text-green-500">
            <span className="text-sm font-medium">Cadastrar</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/planos-professores"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-purple-50 rounded-full w-fit">
            <CreditCard className="h-6 w-6 text-purple-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Planos dos Professores</h2>
          <p className="text-gray-600 mt-2">
            Visualizar e gerenciar os planos dos professores
          </p>
          <div className="mt-4 flex items-center text-purple-500">
            <span className="text-sm font-medium">Ver planos</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardAdmin;
