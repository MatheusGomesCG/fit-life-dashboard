
import React from "react";
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
  HelpCircle
} from "lucide-react";

const ModernSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mainNavItems = [
    { path: "/dashboard-professor", icon: Activity, label: "DASHBOARD" },
    { path: "/gerenciar-alunos", icon: Users, label: "ALUNOS" },
    { path: "/gerenciar-ficha-treino", icon: FileText, label: "TREINOS" },
    { path: "/gerenciar-pagamentos", icon: DollarSign, label: "FINANCEIRO" },
    { path: "/gerenciar-agendamentos", icon: Calendar, label: "AGENDAMENTOS" },
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
    <div className="w-64 bg-gray-900 text-white h-full">
      <div className="p-4 flex items-center">
        <button className="mr-3 text-white cursor-pointer">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <div className="bg-orange-500 h-6 w-6 flex items-center justify-center rounded-sm mr-1">
            <Dumbbell className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg">FITNESS PRO</span>
        </div>
      </div>
      
      <nav className="mt-6">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 flex items-center cursor-pointer transition-colors ${
                isActive(item.path) 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
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
      </nav>
    </div>
  );
};

export default ModernSidebar;
