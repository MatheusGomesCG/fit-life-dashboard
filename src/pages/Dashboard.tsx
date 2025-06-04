
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  Clock 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { buscarPagamentosPorAluno, Pagamento } from "@/services/pagamentosService";
import { format } from "date-fns";
import LoadingSpinner from "@/components/LoadingSpinner";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
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

  const proximoPagamento = pagamentos
    .filter(p => p.status === "pendente")
    .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())[0];

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard do Aluno</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao sistema de avaliação física, {user?.nome || "Aluno"}
        </p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Meus Treinos */}
        <Link
          to="/meus-treinos"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="mb-4 p-3 bg-blue-50 rounded-full w-fit group-hover:bg-blue-100 transition-colors">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Meus Treinos</h2>
          <p className="text-gray-600 text-sm mb-4">
            Visualize seu plano de treinamento atualizado
          </p>
          <div className="flex items-center text-blue-500 font-medium">
            <span className="text-sm">Ver treinos</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Medidas Físicas */}
        <Link
          to="/minhas-medidas"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="mb-4 p-3 bg-green-50 rounded-full w-fit group-hover:bg-green-100 transition-colors">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Minhas Medidas</h2>
          <p className="text-gray-600 text-sm mb-4">
            Acompanhe sua evolução física e resultados
          </p>
          <div className="flex items-center text-green-500 font-medium">
            <span className="text-sm">Ver progresso</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Pagamentos */}
        <Link
          to="/meus-pagamentos"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="mb-4 p-3 bg-purple-50 rounded-full w-fit group-hover:bg-purple-100 transition-colors">
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Pagamentos</h2>
          <p className="text-gray-600 text-sm mb-4">
            Verifique suas mensalidades e status de pagamento
          </p>
          <div className="flex items-center text-purple-500 font-medium">
            <span className="text-sm">Ver pagamentos</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Agendamento */}
        <Link
          to="/agendamentos"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="mb-4 p-3 bg-amber-50 rounded-full w-fit group-hover:bg-amber-100 transition-colors">
            <Calendar className="h-6 w-6 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Agendamento</h2>
          <p className="text-gray-600 text-sm mb-4">
            Agende avaliações e consultas com seu professor
          </p>
          <div className="flex items-center text-amber-500 font-medium">
            <span className="text-sm">Ver agenda</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Card de Chat */}
        <Link
          to="/chat"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
        >
          <div className="mb-4 p-3 bg-red-50 rounded-full w-fit group-hover:bg-red-100 transition-colors">
            <MessageSquare className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Chat de Suporte</h2>
          <p className="text-gray-600 text-sm mb-4">
            Tire dúvidas sobre seus treinos e exercícios
          </p>
          <div className="flex items-center text-red-500 font-medium">
            <span className="text-sm">Iniciar chat</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Seção de informações adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próxima avaliação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Próxima avaliação
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Data:</span>
              </div>
              <span className="font-medium text-gray-900">Não agendado</span>
            </div>
            <div className="pt-2">
              <Link 
                to="/agendamentos" 
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-fitness-primary text-white rounded-lg hover:bg-fitness-primary/90 transition-colors font-medium"
              >
                Agendar avaliação física
              </Link>
            </div>
          </div>
        </div>

        {/* Próximo pagamento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Próximo pagamento
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="small" />
            </div>
          ) : proximoPagamento ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Vencimento:</span>
                </div>
                <span className="font-medium text-gray-900">
                  {format(new Date(proximoPagamento.data_vencimento), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Valor:</span>
                </div>
                <span className="font-medium text-gray-900">
                  R$ {proximoPagamento.valor.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Status:</span>
                </div>
                <span className="font-medium flex items-center">
                  {proximoPagamento.status === "pendente" ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-amber-600">Pendente</span>
                    </>
                  ) : proximoPagamento.status === "pago" ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-green-600">Pago</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-500 mr-2">⚠️</span>
                      <span className="text-red-600">Atrasado</span>
                    </>
                  )}
                </span>
              </div>
              <div className="pt-2">
                <Link 
                  to="/meus-pagamentos" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Ver todos os pagamentos
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Não há pagamentos pendentes.
              </p>
              <Link 
                to="/meus-pagamentos" 
                className="text-fitness-primary hover:underline font-medium"
              >
                Ver histórico de pagamentos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
