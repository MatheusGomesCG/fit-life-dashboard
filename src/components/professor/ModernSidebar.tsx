
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
      <div className="p-3 md:p-4 flex items-center justify-between border-b border-gray-800">
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="bg-orange-500 h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded-sm mr-2 md:mr-3 flex-shrink-0">
            <Dumbbell className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="font-bold text-lg md:text-xl tracking-wide">GYMCLOUD</span>
          )}
        </div>
        
        {/* Botão de colapso apenas no desktop */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-gray-800 p-1.5 md:p-2 rounded transition-colors"
            title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />}
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
              className={`px-3 md:px-4 py-2.5 md:py-3 flex items-center cursor-pointer transition-colors ${
                itemIsActive 
                  ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              title={isCollapsed && !isMobile ? item.label : undefined}
              onClick={() => {
                if (isMobile) setIsOpen(false);
              }}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
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
                <span className="text-xs md:text-sm">{item.label}</span>
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
                <span className="text-xs md:text-sm">{item.label}</span>
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

  // Desktop: Fixed sidebar com botão de expansão sempre visível
  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-12 md:w-16' : 'w-56 md:w-64'} flex-shrink-0 relative`}>
      <SidebarContent />
      
      {/* Botão flutuante para expandir quando colapsada */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute top-3 md:top-4 -right-2 md:-right-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-0.5 md:p-1 shadow-lg transition-colors z-10"
          title="Expandir sidebar"
        >
          <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
        </button>
      )}
    </div>
  );
};

export default ModernSidebar;
