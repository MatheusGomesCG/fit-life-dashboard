import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  Clock,
  Menu,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { buscarPagamentosPorAluno, Pagamento } from "@/services/pagamentosService";
import { format } from "date-fns";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarPagamentos();
  }, [user]);

  const carregarPagamentos = async () => {
    try {
      setIsLoading(true);
      if (user?.id) {
        const pagamentosData = await buscarPagamentosPorAluno(user.id);
        setPagamentos(pagamentosData);
      }
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const proximoPagamento = pagamentos
    .filter(p => p.status === "pendente")
    .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())[0];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard do Aluno</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo ao sistema de avaliação física, {user?.nome || "Aluno"}
          </p>
        </div>
        
        {/* Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {user?.nome || "Aluno"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link to="/meus-treinos" className="flex items-center gap-2 w-full">
                <FileText className="h-4 w-4" />
                Meus Treinos
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/minhas-medidas" className="flex items-center gap-2 w-full">
                <TrendingUp className="h-4 w-4" />
                Minhas Medidas
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/meus-pagamentos" className="flex items-center gap-2 w-full">
                <DollarSign className="h-4 w-4" />
                Pagamentos
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/agendamento" className="flex items-center gap-2 w-full">
                <Calendar className="h-4 w-4" />
                Agendamento
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/chat" className="flex items-center gap-2 w-full">
                <MessageSquare className="h-4 w-4" />
                Chat de Suporte
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Meus Treinos */}
        <Link
          to="/meus-treinos"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-blue-50 rounded-full w-fit">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Meus Treinos</h2>
          <p className="text-gray-600 mt-2">
            Visualize seu plano de treinamento atualizado
          </p>
          <div className="mt-4 flex items-center text-blue-500">
            <span className="text-sm font-medium">Ver treinos</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Medidas Físicas */}
        <Link
          to="/minhas-medidas"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-green-50 rounded-full w-fit">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Minhas Medidas</h2>
          <p className="text-gray-600 mt-2">
            Acompanhe sua evolução física e resultados
          </p>
          <div className="mt-4 flex items-center text-green-500">
            <span className="text-sm font-medium">Ver progresso</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Pagamentos */}
        <Link
          to="/meus-pagamentos"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-purple-50 rounded-full w-fit">
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Pagamentos</h2>
          <p className="text-gray-600 mt-2">
            Verifique suas mensalidades e status de pagamento
          </p>
          <div className="mt-4 flex items-center text-purple-500">
            <span className="text-sm font-medium">Ver pagamentos</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Agendamento */}
        <Link
          to="/agendamento"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-amber-50 rounded-full w-fit">
            <Calendar className="h-6 w-6 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Agendamento</h2>
          <p className="text-gray-600 mt-2">
            Agende avaliações e consultas com seu professor
          </p>
          <div className="mt-4 flex items-center text-amber-500">
            <span className="text-sm font-medium">Ver agenda</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Chat */}
        <Link
          to="/chat"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-red-50 rounded-full w-fit">
            <MessageSquare className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Chat de Suporte</h2>
          <p className="text-gray-600 mt-2">
            Tire dúvidas sobre seus treinos e exercícios
          </p>
          <div className="mt-4 flex items-center text-red-500">
            <span className="text-sm font-medium">Iniciar chat</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próxima avaliação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próxima avaliação
          </h2>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Data:</span>
            </div>
            <span className="font-medium">Não agendado</span>
          </div>
          <div className="text-center mt-4">
            <Link to="/agendamento" className="text-fitness-primary hover:underline font-medium">
              Agendar avaliação física
            </Link>
          </div>
        </div>

        {/* Próximo pagamento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Próximo pagamento
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="small" />
            </div>
          ) : proximoPagamento ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Vencimento:</span>
                </div>
                <span className="font-medium">{format(new Date(proximoPagamento.data_vencimento), "dd/MM/yyyy")}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 py-3">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Valor:</span>
                </div>
                <span className="font-medium">R$ {proximoPagamento.valor.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Status:</span>
                </div>
                <span className="font-medium flex items-center">
                  {proximoPagamento.status === "pendente" ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-amber-600">Pendente</span>
                    </>
                  ) : proximoPagamento.status === "pago" ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600">Pago</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-500 mr-1">⚠️</span>
                      <span className="text-red-600">Atrasado</span>
                    </>
                  )}
                </span>
              </div>
              <div className="text-center mt-4">
                <Link to="/meus-pagamentos" className="text-fitness-primary hover:underline font-medium">
                  Ver todos os pagamentos
                </Link>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center py-3">
              Não há pagamentos pendentes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
