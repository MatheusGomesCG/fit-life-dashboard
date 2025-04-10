
import React from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, FileText, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo ao sistema de avaliação física, {user?.nome}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Alunos */}
        <Link
          to="/alunos"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-blue-50 rounded-full w-fit">
            <Users className="h-6 w-6 text-fitness-secondary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Alunos</h2>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie seus alunos cadastrados
          </p>
        </Link>

        {/* Card de Novo Cadastro */}
        <Link
          to="/cadastrar-aluno"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 p-3 bg-green-50 rounded-full w-fit">
            <UserPlus className="h-6 w-6 text-fitness-primary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Novo Aluno</h2>
          <p className="text-gray-600 mt-2">
            Cadastre um novo aluno no sistema
          </p>
        </Link>

        {/* Card de Fichas de Treino */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="mb-4 p-3 bg-purple-50 rounded-full w-fit">
            <FileText className="h-6 w-6 text-fitness-accent" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Fichas de Treino
          </h2>
          <p className="text-gray-600 mt-2">
            Gere fichas de treino personalizadas
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sobre o sistema
          </h2>
          <p className="text-gray-600">
            Este sistema de avaliação física permite o cadastro de alunos, cálculo
            automático de métricas como percentual de gordura e IMC, além da
            geração de fichas de treino personalizadas com base nas
            características individuais de cada aluno.
          </p>
          <div className="mt-6 flex items-center text-fitness-primary">
            <Activity className="h-5 w-5 mr-2" />
            <span className="font-medium">FitLife - Sistema de Avaliação Física</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
