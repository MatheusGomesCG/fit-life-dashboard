
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import ProfessorNavigation from "@/components/professor/ProfessorNavigation";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AlunoNavigation from "@/components/aluno/AlunoNavigation";
import ProfessorLayout from "@/components/professor/ProfessorLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  console.log("🔄 [Layout] Renderizando layout", {
    userType: user?.tipo,
    currentPath: location.pathname
  });

  // Lista de páginas de professor que devem usar o layout moderno
  const professorPages = [
    "/dashboard-professor",
    "/gerenciar-alunos",
    "/cadastrar-aluno",
    "/editar-aluno",
    "/listar-alunos",
    "/cadastrar-treino",
    "/gerenciar-ficha-treino",
    "/novo-agendamento",
    "/gerenciar-agendamentos",
    "/cadastrar-pagamento",
    "/editar-pagamento",
    "/gerenciar-pagamentos",
    "/chat-professor",
    "/fotos-aluno",
    "/configuracoes-professor"
  ];

  // Verifica se a página atual é uma página de professor
  const isProfessorPage = professorPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + "/")
  );

  // Se for uma página de professor, usar o layout moderno
  if (user?.tipo === "professor" && isProfessorPage) {
    return <ProfessorLayout>{children}</ProfessorLayout>;
  }

  const renderNavigation = () => {
    switch (user?.tipo) {
      case "professor":
        return <ProfessorNavigation />;
      case "admin":
        return <AdminNavigation />;
      case "aluno":
        return <AlunoNavigation />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
