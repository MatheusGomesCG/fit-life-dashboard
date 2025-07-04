
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
  X
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
      <div className={`p-3 md:p-4 flex items-center justify-between border-b border-gray-800 ${
        isCollapsed && !isMobile ? 'px-2' : ''
      }`}>
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center w-full' : ''}`}>
          <div className={`bg-orange-500 h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded-sm flex-shrink-0 ${
            isCollapsed && !isMobile ? 'mr-0' : 'mr-2 md:mr-3'
          }`}>
            <Dumbbell className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="font-bold text-base md:text-lg xl:text-xl tracking-wide">GYMCLOUD</span>
          )}
        </div>
        
        {/* Botão de colapso apenas no desktop */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-white hover:bg-gray-800 p-1.5 md:p-2 rounded transition-colors ${
              isCollapsed ? 'hidden' : ''
            }`}
            title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}
      </div>
      
      <nav className="mt-2 md:mt-4 flex-1 overflow-y-auto">
        {/* Menu Principal */}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const itemIsActive = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-2 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 flex items-center cursor-pointer transition-colors group ${
                itemIsActive 
                  ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              } ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}`}
              title={isCollapsed && !isMobile ? item.label : undefined}
              onClick={() => {
                if (isMobile) setIsOpen(false);
              }}
            >
              <Icon className={`h-4 w-4 md:h-5 md:w-5 flex-shrink-0 ${
                isCollapsed && !isMobile ? 'mr-0' : 'mr-2 md:mr-3'
              }`} />
              {(!isCollapsed || isMobile) && (
                <span className="text-xs md:text-sm font-medium truncate">{item.label}</span>
              )}
              {/* Tooltip para modo colapsado */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
        
        {/* Seções adicionais apenas quando não colapsado */}
        {(!isCollapsed || isMobile) && (
          <>
            <div className="mt-4 md:mt-6 px-3 md:px-4 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                AÇÕES RÁPIDAS
              </span>
            </div>
            
            {quickActions.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 md:px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  if (isMobile) setIsOpen(false);
                }}
              >
                <span className="text-xs md:text-sm truncate">{item.label}</span>
              </Link>
            ))}
            
            <div className="mt-4 md:mt-6 px-3 md:px-4 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                GESTÃO
              </span>
            </div>
            
            {managementItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 md:px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  if (isMobile) setIsOpen(false);
                }}
              >
                <span className="text-xs md:text-sm truncate">{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    </div>
  );

  // Mobile: Sheet/Drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-2 md:top-3 left-2 md:left-3 z-50 bg-gray-900 text-white hover:bg-gray-800 shadow-lg rounded-md p-1.5 md:p-2 h-8 w-8 md:h-10 md:w-10"
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 md:w-80 max-w-[85vw]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fixed sidebar com animação suave
  return (
    <>
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex-shrink-0 relative`}>
        <SidebarContent />
      </div>
      
      {/* Botão flutuante para expandir quando colapsada */}
      {isCollapsed && !isMobile && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-16 left-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-all duration-300 z-20 group"
          title="Expandir sidebar"
        >
          <ChevronRight className="h-4 w-4" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Expandir menu
          </div>
        </button>
      )}
    </>
  );
};

export default ModernSidebar;
