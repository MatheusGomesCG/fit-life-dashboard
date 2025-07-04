
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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
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

  console.log("🎨 [ModernSidebar] === RENDERIZANDO MODERN SIDEBAR ===");
  console.log("🎨 [ModernSidebar] Estado atual:", {
    currentPath: location.pathname,
    isCollapsed,
    isMobile,
    isOpen,
    timestamp: new Date().toISOString()
  });

  const isActive = (path: string) => {
    const result = location.pathname === path || location.pathname.startsWith(path + "/");
    console.log(`🔗 [ModernSidebar] isActive check: ${path} vs ${location.pathname} = ${result}`);
    return result;
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

  const SidebarContent = () => (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="bg-orange-500 h-8 w-8 flex items-center justify-center rounded-sm mr-3">
            <Dumbbell className="h-5 w-5" />
          </div>
          {(!isCollapsed || isMobile) && <span className="font-bold text-xl">GYMCLOUD</span>}
        </div>
        {!isMobile && (
          <button 
            onClick={() => {
              console.log("🔄 [ModernSidebar] Toggle collapse:", !isCollapsed);
              setIsCollapsed(!isCollapsed);
            }}
            className="text-white hover:bg-gray-800 p-2 rounded cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        )}
        {isMobile && (
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-gray-800 p-2 rounded cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <nav className="mt-4 flex-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const itemIsActive = isActive(item.path);
          console.log(`🔗 [ModernSidebar] Renderizando item: ${item.label} (${item.path}) - Active: ${itemIsActive}`);
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`px-4 py-3 flex items-center cursor-pointer transition-colors ${
                itemIsActive 
                  ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              title={isCollapsed && !isMobile ? item.label : undefined}
              onClick={() => {
                console.log(`🖱️ [ModernSidebar] Clicou em: ${item.label} -> ${item.path}`);
                if (isMobile) setIsOpen(false);
              }}
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
        
        {(!isCollapsed || isMobile) && (
          <>
            <div className="mt-6 px-4 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AÇÕES RÁPIDAS</span>
            </div>
            
            {categoryItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => {
                  console.log(`🖱️ [ModernSidebar] Clicou em ação rápida: ${item.label} -> ${item.path}`);
                  if (isMobile) setIsOpen(false);
                }}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
            
            <div className="mt-6 px-4 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">GESTÃO</span>
            </div>
            
            {managementItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 flex items-center cursor-pointer transition-colors ${
                  isActive(item.path) 
                    ? "bg-gray-800 text-white border-r-4 border-orange-500" 
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => {
                  console.log(`🖱️ [ModernSidebar] Clicou em gestão: ${item.label} -> ${item.path}`);
                  if (isMobile) setIsOpen(false);
                }}
              >
                <span className="text-sm">{item.label}</span>
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
      <>
        {/* Trigger button for mobile */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-gray-900 text-white hover:bg-gray-800 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
      <SidebarContent />
    </div>
  );
};

console.log("📦 [ModernSidebar] Componente ModernSidebar definido e exportado");

export default ModernSidebar;
