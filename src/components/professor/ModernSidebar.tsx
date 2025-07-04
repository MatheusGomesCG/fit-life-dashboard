import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  FileText, 
  DollarSign, 
  Calendar, 
  Activity,
  Dumbbell,
  Menu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Ruler,
  X,
  Home,
  Plus,
  BarChart3
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ModernSidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const mainNavItems = [
    { path: "/dashboard-professor", icon: Activity, label: "DASHBOARD" },
    { path: "/gerenciar-alunos", icon: Users, label: "ALUNOS" },
    { path: "/gerenciar-ficha-treino", icon: FileText, label: "TREINOS" },
    { path: "/historico-geral", icon: Ruler, label: "MEDIDAS" },
    { path: "/gerenciar-pagamentos", icon: DollarSign, label: "FINANCEIRO" },
    { path: "/gerenciar-agendamentos", icon: Calendar, label: "AGENDAMENTOS" },
    { path: "/configuracoes-professor", icon: Settings, label: "CONFIGURAÇÕES" },
  ];

  // Navegação mobile expandida com mais funcionalidades
  const mobileNavItems = [
    { path: "/dashboard-professor", icon: Home, label: "Início" },
    { path: "/gerenciar-alunos", icon: Users, label: "Alunos" },
    { path: "/cadastrar-aluno", icon: Plus, label: "Adicionar" },
    { path: "/gerenciar-pagamentos", icon: DollarSign, label: "Financeiro" },
    { path: "/configuracoes-professor", icon: Settings, label: "Perfil" },
  ];

  const quickActions = [
    { path: "/cadastrar-aluno", label: "Cadastrar Aluno" },
    { path: "/novo-treino", label: "Novo Treino" },
    { path: "/listar-alunos", label: "Lista de Alunos" },
  ];

  const managementItems = [
    { path: "/chat-professor", label: "Chat com Alunos" },
    { path: "/novo-agendamento", label: "Novo Agendamento" },
    { path: "/cadastrar-pagamento", label: "Cadastrar Pagamento" },
  ];

  const SidebarContent = () => (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* Header da Sidebar */}
      <div className={`p-4 flex items-center justify-between border-b border-gray-800 ${
        isCollapsed && !isMobile ? 'px-2' : ''
      }`}>
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center w-full' : ''}`}>
          <div className={`bg-orange-500 h-8 w-8 flex items-center justify-center rounded-sm flex-shrink-0 ${
            isCollapsed && !isMobile ? 'mr-0' : 'mr-3'
          }`}>
            <Dumbbell className="h-5 w-5" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="font-bold text-lg tracking-wide">GYMCLOUD</span>
          )}
        </div>
        
        {/* Botão de colapso apenas no desktop - SEMPRE VISÍVEL */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-gray-800 p-1.5 rounded transition-colors flex-shrink-0 z-50"
            title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      <nav className="mt-4 flex-1 overflow-y-auto">
        {/* Menu Principal */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const itemIsActive = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 flex items-center cursor-pointer transition-colors group relative ${
                itemIsActive 
                  ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}`}
              title={isCollapsed && !isMobile ? item.label : undefined}
              onClick={() => {
                if (isMobile) setIsOpen(false);
              }}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${
                isCollapsed && !isMobile ? 'mr-0' : 'mr-3'
              }`} />
              {(!isCollapsed || isMobile) && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {/* Tooltip para modo colapsado */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
        
        {/* Seções adicionais apenas quando não colapsado */}
        {(!isCollapsed || isMobile) && (
          <>
            <div className="mt-6 px-4 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                AÇÕES RÁPIDAS
              </span>
            </div>
            
            {quickActions.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  if (isMobile) setIsOpen(false);
                }}
              >
                <span className="text-sm truncate">{item.label}</span>
              </Link>
            ))}
            
            <div className="mt-6 px-4 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                GESTÃO
              </span>
            </div>
            
            {managementItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  if (isMobile) setIsOpen(false);
                }}
              >
                <span className="text-sm truncate">{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  );

  // Mobile: Apenas navegação inferior
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const itemIsActive = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                  itemIsActive 
                    ? "text-orange-500" 
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  itemIsActive ? "bg-orange-500 text-white" : ""
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <div className={`transition-all duration-300 ease-in-out flex-shrink-0 relative ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className={`fixed left-0 top-0 h-full z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out`}>
        <SidebarContent />
      </div>
    </div>
  );
};

export default ModernSidebar;
