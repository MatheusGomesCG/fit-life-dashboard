import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  TrendingUp,
  ChevronRight,
  Activity,
  BarChart3,
  Receipt,
  LogOut
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
  const { user, logout } = useAuth();
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
      console.log("🔄 [DashboardAdmin] Iniciando carregamento de estatísticas...");

      // Buscar total de professores
      const { data: professores, error: professoresError } = await supabase
        .from('professor_profiles')
        .select('id, status');

      console.log("📊 [DashboardAdmin] Professores encontrados:", { 
        professores, 
        error: professoresError,
        total: professores?.length || 0 
      });

      if (professoresError) {
        console.error("❌ [DashboardAdmin] Erro ao buscar professores:", professoresError);
        throw professoresError;
      }

      // Buscar professores com planos ativos
      const { data: planos, error: planosError } = await supabase
        .from('professor_planos')
        .select('professor_id')
        .eq('status', 'ativo');

      console.log("📊 [DashboardAdmin] Planos encontrados:", { 
        planos, 
        error: planosError,
        total: planos?.length || 0 
      });

      if (planosError) {
        console.error("❌ [DashboardAdmin] Erro ao buscar planos:", planosError);
        // Não falhar se não conseguir buscar planos, apenas definir como 0
      }

      const total = professores?.length || 0;
      const ativos = professores?.filter(p => p.status === 'ativo').length || 0;
      const inativos = professores?.filter(p => p.status === 'inativo').length || 0;
      const suspensos = professores?.filter(p => p.status === 'suspenso').length || 0;
      const comPlano = planos?.length || 0;

      const newStats = {
        total,
        ativos,
        inativos: inativos + suspensos, // Combinando inativos e suspensos
        comPlano
      };

      console.log("✅ [DashboardAdmin] Estatísticas calculadas:", newStats);
      setStats(newStats);

    } catch (error) {
      console.error("❌ [DashboardAdmin] Erro ao carregar estatísticas:", error);
      // Definir valores padrão em caso de erro
      setStats({
        total: 0,
        ativos: 0,
        inativos: 0,
        comPlano: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 [DashboardAdmin] Iniciando logout...");
      await logout();
    } catch (error) {
      console.error("❌ [DashboardAdmin] Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo ao painel de administração, {user?.nome || "Admin"}
          </p>
        </div>
        
        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Professores</p>
              <div className="text-2xl font-bold text-gray-900">
                {isLoading ? <LoadingSpinner size="small" /> : stats.total}
              </div>
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
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <LoadingSpinner size="small" /> : stats.ativos}
              </div>
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
              <div className="text-2xl font-bold text-amber-600">
                {isLoading ? <LoadingSpinner size="small" /> : stats.inativos}
              </div>
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
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? <LoadingSpinner size="small" /> : stats.comPlano}
              </div>
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
          to="/admin/planos"
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

        <Link
          to="/admin/dashboard"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-indigo-50 rounded-full w-fit">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Avançado</h2>
          <p className="text-gray-600 mt-2">
            Métricas detalhadas, gráficos e relatórios de crescimento
          </p>
          <div className="mt-4 flex items-center text-indigo-500">
            <span className="text-sm font-medium">Ver dashboard</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/transacoes"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-emerald-50 rounded-full w-fit">
            <Receipt className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Gestão de Transações</h2>
          <p className="text-gray-600 mt-2">
            Gerenciar pagamentos e transações dos professores
          </p>
          <div className="mt-4 flex items-center text-emerald-500">
            <span className="text-sm font-medium">Gerenciar</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/admin/relatorios"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-orange-50 rounded-full w-fit">
            <TrendingUp className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Relatórios Financeiros</h2>
          <p className="text-gray-600 mt-2">
            Gerar e exportar relatórios detalhados em Excel
          </p>
          <div className="mt-4 flex items-center text-orange-500">
            <span className="text-sm font-medium">Ver relatórios</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardAdmin;
