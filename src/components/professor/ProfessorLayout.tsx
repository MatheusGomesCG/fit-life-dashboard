
import React from "react";
import ModernSidebar from "./ModernSidebar";
import ModernHeader from "./ModernHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

const ProfessorLayout: React.FC<ProfessorLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  console.log("🏗️ [ProfessorLayout] === RENDERIZANDO PROFESSOR LAYOUT ===");
  console.log("🏗️ [ProfessorLayout] Props recebidas:", {
    hasChildren: !!children,
    childrenType: typeof children,
    isMobile
  });
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - responsiva */}
      <ModernSidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ModernHeader />
        
        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;
