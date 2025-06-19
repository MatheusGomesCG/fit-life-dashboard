
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

  console.log("🔄 [Layout] === INÍCIO DA VERIFICAÇÃO ===");
  console.log("🔄 [Layout] Renderizando layout", {
    userType: user?.tipo,
    currentPath: location.pathname,
    user: user,
    hasUser: !!user
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

  console.log("📋 [Layout] Lista de páginas de professor:", professorPages);
  console.log("🎯 [Layout] Página atual:", location.pathname);

  // Verifica se a página atual é uma página de professor
  const isProfessorPage = professorPages.some(page => {
    const isMatch = location.pathname === page || location.pathname.startsWith(page + "/");
    console.log(`🔍 [Layout] Checking ${page} against ${location.pathname}: ${isMatch}`);
    return isMatch;
  });

  console.log("🎯 [Layout] Resultado da verificação:", {
    isProfessorPage,
    userTipo: user?.tipo,
    shouldUseProfessorLayout: user?.tipo === "professor" && isProfessorPage,
    userExists: !!user,
    userTipoExact: user?.tipo
  });

  // Se for usuário professor E estiver em uma página de professor, usar o layout moderno
  if (user?.tipo === "professor" && isProfessorPage) {
    console.log("✅ [Layout] === USANDO PROFESSOR LAYOUT ===");
    console.log("✅ [Layout] Usando ProfessorLayout para:", location.pathname);
    console.log("✅ [Layout] Dados do usuário:", {
      id: user.id,
      nome: user.nome,
      tipo: user.tipo
    });
    return <ProfessorLayout>{children}</ProfessorLayout>;
  }

  console.log("❌ [Layout] === USANDO LAYOUT PADRÃO ===");
  console.log("❌ [Layout] Motivo:", {
    userType: user?.tipo,
    isProfessorPage,
    condition1: user?.tipo === "professor",
    condition2: isProfessorPage,
    bothConditions: user?.tipo === "professor" && isProfessorPage
  });
  console.log("❌ [Layout] Usando layout padrão para:", location.pathname);

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
