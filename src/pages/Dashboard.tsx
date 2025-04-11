
import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Activity, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  MessageSquare,
  ChevronRight 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard do Aluno</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao sistema de avaliação física, {user?.nome}
        </p>
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

      <div className="mt-10">
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
      </div>
    </div>
  );
};

export default Dashboard;
