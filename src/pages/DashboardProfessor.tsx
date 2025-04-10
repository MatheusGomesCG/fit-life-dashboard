
import React from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Activity, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardProfessor: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, Professor {user?.nome || ""}
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/gerenciar-alunos"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold ml-3">Gerenciar Alunos</h2>
          </div>
          <p className="text-gray-600 mb-4 flex-1">
            Visualize, edite e organize todos os seus alunos cadastrados.
          </p>
          <div className="flex items-center text-blue-500 font-medium">
            <span>Acessar</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/cadastrar-aluno"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <UserPlus className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold ml-3">Novo Aluno</h2>
          </div>
          <p className="text-gray-600 mb-4 flex-1">
            Cadastre um novo aluno e comece a criar seus treinos personalizados.
          </p>
          <div className="flex items-center text-green-500 font-medium">
            <span>Cadastrar</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/fichas-treino"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold ml-3">Fichas de Treino</h2>
          </div>
          <p className="text-gray-600 mb-4 flex-1">
            Gerencie e visualize todas as fichas de treino dos seus alunos.
          </p>
          <div className="flex items-center text-purple-500 font-medium">
            <span>Visualizar</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <p className="text-gray-800">Nenhuma atividade recente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfessor;
