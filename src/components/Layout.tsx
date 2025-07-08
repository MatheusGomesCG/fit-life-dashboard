
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import AlunoNavigation from '@/components/aluno/AlunoNavigation';
import ProfessorLayout from '@/components/professor/ProfessorLayout';
import ThemeToggle from '@/components/ThemeToggle';

const Layout: React.FC = () => {
  const { user } = useAuth();

  // Se o usuário for professor, use o layout do professor
  if (user?.tipo === 'professor') {
    return (
      <ProfessorLayout>
        <Outlet />
      </ProfessorLayout>
    );
  }

  // Layout para alunos
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navegação do aluno */}
      {user?.tipo === 'aluno' && <AlunoNavigation />}
      
      {/* Header apenas para usuários não autenticados ou admin */}
      {(!user || user.tipo === 'admin') && (
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">FitnessPro</h1>
            <ThemeToggle />
          </div>
        </header>
      )}
      
      <main className={`container mx-auto px-4 py-6 ${user?.tipo === 'aluno' ? 'pt-20 pb-24' : ''}`}>
        <Outlet />
      </main>
      
      <Toaster />
    </div>
  );
};

export default Layout;
