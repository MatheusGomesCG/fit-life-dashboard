
import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Users, ArrowRight, Activity } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to appropriate dashboard if already authenticated
  if (isAuthenticated) {
    if (user?.tipo === "professor") {
      return <Navigate to="/dashboard-professor" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, show the selection screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-12">
        <div className="flex justify-center">
          <Activity className="h-16 w-16 text-fitness-primary" />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          FitLife
        </h1>
        <p className="mt-3 text-xl text-gray-500">
          Sistema de Avaliação Física
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link to="/login?tipo=aluno" className="group">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow flex flex-col items-center h-full">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sou Aluno</h2>
            <p className="text-gray-500 mb-6">Acesse sua ficha de treino e acompanhe seu progresso</p>
            <div className="mt-auto flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
              <span className="font-medium">Entrar</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link to="/login?tipo=professor" className="group">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow flex flex-col items-center h-full">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <Users className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sou Professor</h2>
            <p className="text-gray-500 mb-6">Gerencie seus alunos e crie fichas de treino personalizadas</p>
            <div className="mt-auto flex items-center text-green-600 group-hover:text-green-800 transition-colors">
              <span className="font-medium">Entrar</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Index;
