
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Home, Activity, Users, DollarSign, FileText, TrendingUp, MessageSquare, Calendar } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const authContext = useAuth();
  const location = useLocation();

  // Safe destructuring with fallbacks
  const {
    isAuthenticated = false,
    user = null,
    logout = () => {},
    loading = true
  } = authContext || {};

  // Verificar se é uma rota pública (login, cadastro de professor ou home)
  const isPublicRoute = ["/login", "/cadastrar-professor", "/"].includes(location.pathname);

  // Verificar se é a página inicial ou login
  const shouldHideSidebar = location.pathname === "/" || location.pathname === "/login";

  // Show loading spinner while auth is loading
  if (loading) {
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

  // Define os itens de menu com base no tipo de usuário (aluno ou professor)
  const menuItems = user?.tipo === "professor" ? [{
    to: "/dashboard-professor",
    icon: Home,
    label: "Dashboard"
  }, {
    to: "/gerenciar-alunos",
    icon: Users,
    label: "Alunos"
  }, {
    to: "/cadastrar-aluno",
    icon: User,
    label: "Novo Aluno"
  }, {
    to: "/gerenciar-fichas",
    icon: FileText,
    label: "Fichas de Treino"
  }, {
    to: "/gerenciar-pagamentos",
    icon: DollarSign,
    label: "Pagamentos"
  }, {
    to: "/agendamentos",
    icon: Calendar,
    label: "Agendamentos"
  }, {
    to: "/chat-professor",
    icon: MessageSquare,
    label: "Chat"
  }] : [{
    to: "/dashboard",
    icon: Home,
    label: "Dashboard"
  }, {
    to: "/meus-treinos",
    icon: FileText,
    label: "Meus Treinos"
  }, {
    to: "/minhas-medidas",
    icon: TrendingUp,
    label: "Medidas"
  }, {
    to: "/meus-pagamentos",
    icon: DollarSign,
    label: "Pagamentos"
  }, {
    to: "/agendamento",
    icon: Calendar,
    label: "Agendamento"
  }, {
    to: "/chat",
    icon: MessageSquare,
    label: "Chat"
  }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho - mostrar sempre */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-fitness-primary" />
            <Link to="/" className="text-xl font-bold text-fitness-dark hover:text-fitness-primary">
              GymCloud
            </Link>
          </div>
          
          {/* Mostrar info do usuário apenas se autenticado e não carregando */}
          {isAuthenticated && user && user.tipo && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium">{user.nome}</span>
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {user.tipo === "professor" ? "Professor" : user.tipo === "admin" ? "Admin" : "Aluno"}
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
          )}

          {/* Mostrar botões de login para usuários não autenticados em rotas públicas */}
          {!isAuthenticated && isPublicRoute && location.pathname === "/" && (
            <div className="flex items-center gap-2">
              <Link 
                to="/login?tipo=professor" 
                className="text-sm bg-fitness-primary text-white px-4 py-2 rounded-md hover:bg-fitness-primary/90 transition-colors"
              >
                Professores
              </Link>
              <Link 
                to="/login?tipo=aluno" 
                className="text-sm border border-fitness-primary text-fitness-primary px-4 py-2 rounded-md hover:bg-fitness-primary hover:text-white transition-colors"
              >
                Alunos
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo principal com barra lateral */}
      <div className="flex container mx-auto">
        {/* Barra lateral - Mostrar apenas para usuários autenticados e não em rotas públicas */}
        {!shouldHideSidebar && isAuthenticated && user?.tipo && (
          <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 p-4">
            <nav className="space-y-1">
              {menuItems.map(item => {
                const isActive = location.pathname === item.to || 
                  (item.to !== "/dashboard" && item.to !== "/dashboard-professor" && location.pathname.startsWith(item.to)) ||
                  (item.to === "/gerenciar-fichas" && (location.pathname.startsWith("/ficha-treino") || location.pathname.startsWith("/cadastrar-treino")));
                
                return (
                  <Link 
                    key={item.to} 
                    to={item.to} 
                    className={`flex items-center gap-2 p-3 rounded-md ${
                      isActive 
                        ? "bg-fitness-primary text-white" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Conteúdo principal */}
        <main className={`flex-1 ${shouldHideSidebar ? 'p-0' : 'p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
