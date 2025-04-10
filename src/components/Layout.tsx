
import React, { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Home, Activity, Users, DollarSign } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar se é uma rota pública (login ou cadastro de professor)
  const isPublicRoute = ["/login", "/cadastrar-professor"].includes(location.pathname);

  // Redirecionar para login apenas se não estiver autenticado e não estiver em rota pública
  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      navigate("/login");
    }
  }, [isAuthenticated, isPublicRoute, navigate]);

  // Se for uma rota pública, não exibir o layout completo
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-fitness-primary" />
            <h1 className="text-xl font-bold text-fitness-dark">FitLife</h1>
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium">{user.nome}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-fitness-primary transition-colors"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo principal com barra lateral */}
      <div className="flex container mx-auto">
        {/* Barra lateral */}
        <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 p-4">
          <nav className="space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-2 p-3 rounded-md ${
                location.pathname === "/" ? "bg-fitness-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/alunos"
              className={`flex items-center gap-2 p-3 rounded-md ${
                location.pathname === "/alunos" ? "bg-fitness-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              <Users size={18} />
              <span>Alunos</span>
            </Link>
            <Link
              to="/cadastrar-aluno"
              className={`flex items-center gap-2 p-3 rounded-md ${
                location.pathname === "/cadastrar-aluno" ? "bg-fitness-primary text-white" : "hover:bg-gray-100"
              }`}
            >
              <User size={18} />
              <span>Novo Aluno</span>
            </Link>
            <Link
              to="/gerenciar-pagamentos"
              className={`flex items-center gap-2 p-3 rounded-md ${
                location.pathname === "/gerenciar-pagamentos" || 
                location.pathname.startsWith("/cadastrar-pagamento") ||
                location.pathname.startsWith("/editar-pagamento")
                  ? "bg-fitness-primary text-white" 
                  : "hover:bg-gray-100"
              }`}
            >
              <DollarSign size={18} />
              <span>Pagamentos</span>
            </Link>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
