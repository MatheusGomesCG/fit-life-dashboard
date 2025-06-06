import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Home, Activity, Users, DollarSign, FileText, TrendingUp, MessageSquare, Calendar } from "lucide-react";
const Layout: React.FC = () => {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar se é uma rota pública (login, cadastro de professor ou home)
  const isPublicRoute = ["/login", "/cadastrar-professor", "/"].includes(location.pathname);

  // Verificar se é a página inicial ou login
  const shouldHideSidebar = location.pathname === "/" || location.pathname === "/login";

  // Redirecionar para home apenas se não estiver autenticado e não estiver em rota pública
  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      navigate("/");
    }
  }, [isAuthenticated, isPublicRoute, navigate]);

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
  return <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-fitness-primary" />
            <h1 className="text-xl font-bold text-fitness-dark">GymCloud</h1>
          </div>
          
          {isAuthenticated && user && <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium">{user.nome}</span>
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {user.tipo === "professor" ? "Professor" : "Aluno"}
                </span>
              </div>
              <button onClick={logout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-fitness-primary transition-colors">
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>}
        </div>
      </header>

      {/* Conteúdo principal com barra lateral */}
      <div className="flex container mx-auto">
        {/* Barra lateral - Esconder na página inicial e de login */}
        {!shouldHideSidebar && <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 p-4">
            <nav className="space-y-1">
              {menuItems.map(item => {
            const isActive = location.pathname === item.to || item.to !== "/dashboard" && item.to !== "/dashboard-professor" && location.pathname.startsWith(item.to) || item.to === "/gerenciar-fichas" && (location.pathname.startsWith("/ficha-treino") || location.pathname.startsWith("/cadastrar-treino"));
            return <Link key={item.to} to={item.to} className={`flex items-center gap-2 p-3 rounded-md ${isActive ? "bg-fitness-primary text-white" : "hover:bg-gray-100"}`}>
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>;
          })}
            </nav>
          </aside>}

        {/* Conteúdo principal - Expandir para tela inteira em rotas públicas */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>;
};
export default Layout;
