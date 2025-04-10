
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DashboardProfessor from "@/pages/DashboardProfessor";
import ListarAlunos from "@/pages/ListarAlunos";
import GerenciarAlunos from "@/pages/GerenciarAlunos";
import CadastrarAluno from "@/pages/CadastrarAluno";
import EditarAluno from "@/pages/EditarAluno";
import FichaTreino from "@/pages/FichaTreino";
import CadastrarProfessor from "@/pages/CadastrarProfessor";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastrar-professor" element={<CadastrarProfessor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-professor" element={<DashboardProfessor />} />
              <Route path="/alunos" element={<ListarAlunos />} />
              <Route path="/gerenciar-alunos" element={<GerenciarAlunos />} />
              <Route path="/cadastrar-aluno" element={<CadastrarAluno />} />
              <Route path="/editar-aluno/:id" element={<EditarAluno />} />
              <Route path="/ficha-treino/:id" element={<FichaTreino />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
