
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
  
  console.log("📱 [ProfessorLayout] Iniciando renderização do ModernSidebar");
  console.log("🎨 [ProfessorLayout] Iniciando renderização do ModernHeader");
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sidebar-container">
        <ModernSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <ModernHeader />
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfessorLayout;
