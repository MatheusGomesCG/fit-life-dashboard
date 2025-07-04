
import React from "react";
import ModernSidebar from "./ModernSidebar";
import ModernHeader from "./ModernHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

const ProfessorLayout: React.FC<ProfessorLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - responsiva */}
      <ModernSidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ModernHeader />
        
        {/* Área de conteúdo */}
        <main className={`flex-1 overflow-y-auto bg-gray-50 ${
          isMobile ? 'p-3' : 'p-6'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;
