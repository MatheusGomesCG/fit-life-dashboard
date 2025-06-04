
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Home, Activity, Users, DollarSign, FileText, TrendingUp, MessageSquare, Calendar, Shield } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Layout: React.FC = () => {
  const {
    isAuthenticated,
    user,
    logout,
    loading
  } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Verificar se é uma rota pública (login, cadastro de professor ou home)
  const isPublicRoute = location.pathname === "/" || 
                       location.pathname === "/login" || 
                       location.pathname.startsWith("/cadastrar-professor");

  // Verificar se é a página inicial ou login
  const shouldHideSidebar = location.pathname === "/" || location.pathname === "/login";

  // Define os itens de menu com base no tipo de usuário (admin, professor ou aluno)
  const getMenuItems = () => {
    if (user?.tipo === "admin") {
      return [{
        to: "/admin/dashboard",
        icon: Shield,
        label: "Admin Dashboard"
      }, {
        to: "/admin/tokens",
        icon: Users,
        label: "Tokens"
      }];
    } else if (user?.tipo === "professor") {
      return [{
        to: "/dashboard-professor",
        icon: Home,
        label: "Dashboard"
      }, {
        to: "/gerenciar-alunos",
        icon: Users,
        label: "Alunos"
      }, {
        to: "/alunos/cadastrar",
        icon: User,
        label: "Novo Aluno"
      }, {
        to: "/gerenciar-fichas",
        icon: FileText,
        label: "Fichas de Treino"
      }, {
        to: "/pagamentos/cadastrar",
        icon: DollarSign,
        label: "Pagamentos"
      }, {
        to: "/agendamentos",
        icon: Calendar,
        label: "Agendamentos"
      }];
    } else {
      return [{
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
    }
  };

  const menuItems = getMenuItems();

  const getUserTypeLabel = () => {
    switch (user?.tipo) {
      case "admin":
        return "Administrador";
      case "professor":
        return "Professor";
      default:
        return "Aluno";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-fitness-primary" />
            <h1 className="text-xl font-bold text-fitness-dark">GymCloud</h1>
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium">{user.nome}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  user.tipo === "admin" ? "bg-red-100 text-red-800" :
                  user.tipo === "professor" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-200 text-gray-700"
                }`}>
                  {getUserTypeLabel()}
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
        </div>
      </header>

      {/* Conteúdo principal com barra lateral */}
      <div className="flex container mx-auto">
        {/* Barra lateral - Esconder na página inicial e de login */}
        {!shouldHideSidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.to || 
                               (item.to !== "/dashboard" && item.to !== "/dashboard-professor" && item.to !== "/admin/dashboard" && location.pathname.startsWith(item.to)) || 
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

        {/* Conteúdo principal - Expandir para tela inteira em rotas públicas */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
