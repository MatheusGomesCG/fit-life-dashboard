
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Activity } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ProfessorNavigation from "./professor/ProfessorNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();

  console.log("🔍 [Layout] Estado atual:", {
    pathname: location.pathname,
    isAuthenticated,
    userType: user?.tipo,
    userName: user?.nome,
    loading,
    userExists: !!user
  });

  // Verificar se é uma rota pública
  const isPublicRoute = ["/login", "/"].includes(location.pathname);

  // Show loading spinner while auth is loading
  if (loading) {
    console.log("⏳ [Layout] Showing loading spinner");
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-fitness-primary" />
              <Link to="/" className="text-xl font-bold text-fitness-dark hover:text-fitness-primary">
                GymCloud
              </Link>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  // Determinar se deve mostrar o menu do professor
  const shouldShowProfessorNavigation = isAuthenticated && 
    user && 
    user.tipo === "professor" && 
    !isPublicRoute;

  console.log("📊 [Layout] Navigation decision:", {
    shouldShowProfessorNavigation,
    isAuthenticated,
    hasUser: !!user,
    isProfessor: user?.tipo === "professor",
    isPublicRoute
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-fitness-primary" />
            <Link to="/" className="text-xl font-bold text-fitness-dark hover:text-fitness-primary">
              GymCloud
            </Link>
          </div>
          
          {/* Mostrar info do usuário se autenticado */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium">{user.nome || user.email?.split("@")[0] || "Usuário"}</span>
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  Professor
                </span>
              </div>
              <button 
                onClick={logout} 
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-fitness-primary transition-colors"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            /* Mostrar botão de login para usuários não autenticados */
            isPublicRoute && location.pathname === "/" && (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="text-sm bg-fitness-primary text-white px-4 py-2 rounded-md hover:bg-fitness-primary/90 transition-colors"
                >
                  Entrar
                </Link>
              </div>
            )
          )}
        </div>
      </header>

      {/* Menu de Navegação do Professor */}
      {shouldShowProfessorNavigation && (
        <ProfessorNavigation />
      )}

      {/* Conteúdo principal */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
