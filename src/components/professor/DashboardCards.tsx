
import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";

interface DashboardCardsProps {
  totalAlunos: number;
  totalRecebido: number;
  totalPendente: number;
  avaliacoesSemana: number;
  isLoading: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  totalAlunos,
  totalRecebido,
  totalPendente,
  avaliacoesSemana,
  isLoading
}) => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Card Total de Alunos */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700">Total de Alunos</h3>
          <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded-full">
            Ativos
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 rounded-full flex items-center justify-center mr-3 md:mr-4">
            <Users className="text-orange-500 h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="animate-pulse h-6 md:h-8 bg-gray-200 rounded w-12 md:w-16"></div>
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{totalAlunos}</p>
            )}
            <p className="text-xs md:text-sm text-gray-500">Alunos cadastrados</p>
          </div>
        </div>
        <div className="mt-3 md:mt-4 grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
          <div className="text-center">
            <p className="text-gray-500">Este mês</p>
            <p className="font-semibold">+{Math.floor(totalAlunos * 0.15)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Ativos</p>
            <p className="font-semibold">{totalAlunos}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Meta</p>
            <p className="font-semibold">{totalAlunos + 20}</p>
          </div>
        </div>
      </div>
      
      {/* Card Total Recebido */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700">Receita Total</h3>
          <span className="bg-green-100 text-green-600 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded-full">
            +12% este mês
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center mr-3 md:mr-4">
            <DollarSign className="text-green-500 h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="animate-pulse h-6 md:h-8 bg-gray-200 rounded w-16 md:w-24"></div>
            ) : (
              <p className="text-xl md:text-3xl font-bold text-gray-800">R$ {totalRecebido.toFixed(0)}</p>
            )}
            <p className="text-xs md:text-sm text-gray-500">Valor recebido</p>
          </div>
        </div>
        <div className="mt-3 md:mt-4 grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
          <div className="text-center">
            <p className="text-gray-500">Recebido</p>
            <p className="font-semibold text-green-600">R$ {totalRecebido.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Pendente</p>
            <p className="font-semibold text-orange-600">R$ {totalPendente.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Meta</p>
            <p className="font-semibold">R$ {(totalRecebido * 1.2).toFixed(0)}</p>
          </div>
        </div>
      </div>
      
      {/* Card Avaliações */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700">Avaliações</h3>
          <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded-full">
            Esta semana
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center mr-3 md:mr-4">
            <Activity className="text-purple-500 h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="animate-pulse h-6 md:h-8 bg-gray-200 rounded w-8 md:w-12"></div>
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{avaliacoesSemana}</p>
            )}
            <p className="text-xs md:text-sm text-gray-500">Avaliações marcadas</p>
          </div>
        </div>
        <div className="mt-3 md:mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min((avaliacoesSemana / 10) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Meta: 10</span>
            <span>Atual: {avaliacoesSemana}</span>
          </div>
        </div>
      </div>
      
      {/* Links Rápidos */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <Link 
            to="/cadastrar-aluno"
            className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer"
          >
            <UserPlus className="text-orange-500 h-5 w-5 md:h-6 md:w-6 mb-2" />
            <span className="text-xs md:text-sm text-gray-700 text-center">Novo Aluno</span>
          </Link>
          <Link 
            to="/novo-treino"
            className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer"
          >
            <FileText className="text-blue-500 h-5 w-5 md:h-6 md:w-6 mb-2" />
            <span className="text-xs md:text-sm text-gray-700 text-center">Novo Treino</span>
          </Link>
          <Link 
            to="/novo-agendamento"
            className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer"
          >
            <Calendar className="text-purple-500 h-5 w-5 md:h-6 md:w-6 mb-2" />
            <span className="text-xs md:text-sm text-gray-700 text-center">Agendar</span>
          </Link>
          <Link 
            to="/gerenciar-pagamentos"
            className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer"
          >
            <BarChart3 className="text-green-500 h-5 w-5 md:h-6 md:w-6 mb-2" />
            <span className="text-xs md:text-sm text-gray-700 text-center">Relatórios</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
