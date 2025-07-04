
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

  console.log("🔄 [Layout] === VERIFICAÇÃO DE LAYOUT ===");
  console.log("🔄 [Layout] Usuário:", {
    id: user?.id,
    tipo: user?.tipo,
    nome: user?.nome
  });
  console.log("🔄 [Layout] Rota atual:", location.pathname);

  // Lista de páginas de professor que devem usar o layout moderno
  const professorPages = [
    "/dashboard-professor",
    "/gerenciar-alunos",
    "/cadastrar-aluno",
    "/editar-aluno",
    "/listar-alunos",
    "/cadastrar-treino",
    "/gerenciar-ficha-treino",
    "/cadastrar-medidas",
    "/novo-agendamento",
    "/gerenciar-agendamentos",
    "/cadastrar-pagamento",
    "/editar-pagamento",
    "/gerenciar-pagamentos",
    "/chat-professor",
    "/gerenciar-fotos",
    "/historico-medidas",
    "/historico-geral",
    "/configuracoes",
    "/configuracoes-professor",
    "/editar-avaliacao"
  ];

  // Verifica se é uma página de professor
  const isProfessorPage = professorPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + "/")
  );

  console.log("🎯 [Layout] Condições:", {
    isProfessorPage,
    userTipo: user?.tipo,
    shouldUseProfessorLayout: user?.tipo === "professor" && isProfessorPage
  });

  // Se for professor E estiver numa página de professor, usar layout moderno
  if (user?.tipo === "professor" && isProfessorPage) {
    console.log("✅ [Layout] USANDO PROFESSOR LAYOUT MODERNO");
    return <ProfessorLayout>{children}</ProfessorLayout>;
  }

  console.log("❌ [Layout] Usando layout padrão");

  const renderNavigation = () => {
    if (!user) return null;
    
    switch (user.tipo) {
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
