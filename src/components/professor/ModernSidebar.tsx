
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  FileText, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  Activity,
  Dumbbell,
  Menu,
  BarChart3,
  CalendarPlus,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";

const ModernSidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainNavItems = [
    { path: "/dashboard-professor", icon: Activity, label: "DASHBOARD" },
    { path: "/gerenciar-alunos", icon: Users, label: "ALUNOS" },
    { path: "/gerenciar-ficha-treino", icon: FileText, label: "TREINOS" },
    { path: "/gerenciar-pagamentos", icon: DollarSign, label: "FINANCEIRO" },
    { path: "/gerenciar-agendamentos", icon: Calendar, label: "AGENDAMENTOS" },
    { path: "/gerenciar-alunos", icon: TrendingUp, label: "HISTÓRICO" },
    { path: "/configuracoes-professor", icon: Settings, label: "CONFIGURAÇÕES" },
  ];

  const categoryItems = [
    { path: "/cadastrar-aluno", label: "Cadastrar Aluno" },
    { path: "/cadastrar-treino", label: "Novo Treino" },
    { path: "/listar-alunos", label: "Lista de Alunos" },
  ];

  const managementItems = [
    { path: "/chat-professor", label: "Chat com Alunos" },
    { path: "/novo-agendamento", label: "Novo Agendamento" },
    { path: "/cadastrar-pagamento", label: "Cadastrar Pagamento" },
  ];

  return (
    <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-orange-500 h-6 w-6 flex items-center justify-center rounded-sm mr-2">
            <Dumbbell className="h-4 w-4" />
          </div>
          {!isCollapsed && <span className="font-bold text-lg">GYMCLOUD</span>}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-gray-800 p-1 rounded cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      
      <nav className="mt-6">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`px-4 py-3 flex items-center cursor-pointer transition-colors ${
                isActive(item.path) 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        
        {!isCollapsed && (
          <>
            <div className="mt-6 px-4 py-2">
              <span className="text-xs font-semibold text-gray-400">AÇÕES RÁPIDAS</span>
            </div>
            
            {categoryItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
            
            <div className="mt-6 px-4 py-2">
              <span className="text-xs font-semibold text-gray-400">GESTÃO</span>
            </div>
            
            {managementItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  );
};

export default ModernSidebar;
