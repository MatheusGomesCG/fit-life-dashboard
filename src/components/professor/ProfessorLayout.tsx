
import React, { createContext, useContext } from "react";
import ModernSidebar from "./ModernSidebar";
import ModernHeader from "./ModernHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

// Context para compartilhar o estado da sidebar
const SidebarContext = createContext<{
  isCollapsed: boolean;
}>({
  isCollapsed: false,
});

export const useSidebarContext = () => useContext(SidebarContext);

const ProfessorLayout: React.FC<ProfessorLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - responsiva */}
      <ModernSidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <ModernHeader />
        
        {/* Área de conteúdo */}
        <main className={`flex-1 overflow-y-auto bg-gray-50 ${
          isMobile ? 'p-2 pt-12' : 'p-3 md:p-4 lg:p-6'
        }`}>
          <div className={`${
            isMobile ? 'max-w-full' : 'max-w-full'
          } mx-auto`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;
