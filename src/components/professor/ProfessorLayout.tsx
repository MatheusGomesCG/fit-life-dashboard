
import React from "react";
import ModernSidebar from "./ModernSidebar";
import ModernHeader from "./ModernHeader";

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

const ProfessorLayout: React.FC<ProfessorLayoutProps> = ({ children }) => {
  console.log("🏗️ [ProfessorLayout] === RENDERIZANDO PROFESSOR LAYOUT ===");
  console.log("🏗️ [ProfessorLayout] Props recebidas:", {
    hasChildren: !!children,
    childrenType: typeof children
  });
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <div className="flex-shrink-0">
        <ModernSidebar />
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ModernHeader />
        
        {/* Área de conteúdo */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;
