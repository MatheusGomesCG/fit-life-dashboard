
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

// Auth
import Index from "@/pages/Index";
import Login from "@/pages/Login";

// Professor Pages
import DashboardProfessor from "@/pages/DashboardProfessor";
import CadastrarAluno from "@/pages/CadastrarAluno";
import EditarAluno from "@/pages/EditarAluno";
import GerenciarAlunos from "@/pages/GerenciarAlunos";
import ListarAlunos from "@/pages/ListarAlunos";
import CadastrarTreino from "@/pages/CadastrarTreino";
import GerenciarFichaTreino from "@/pages/GerenciarFichaTreino";
import FichaTreino from "@/pages/FichaTreino";
import NovoAgendamento from "@/pages/NovoAgendamento";
import GerenciarAgendamentos from "@/pages/GerenciarAgendamentos";
import Agendamento from "@/pages/Agendamento";
import CadastrarPagamento from "@/pages/CadastrarPagamento";
import EditarPagamento from "@/pages/EditarPagamento";
import GerenciarPagamentos from "@/pages/GerenciarPagamentos";
import ChatProfessor from "@/pages/ChatProfessor";
import ConfiguracoesProfessor from "@/pages/ConfiguracoesProfessor";
import GerenciarFotosAluno from "@/pages/GerenciarFotosAluno";
import HistoricoMedidasAluno from "@/pages/HistoricoMedidasAluno";

// Aluno Pages
import Dashboard from "@/pages/Dashboard";
import MeusTreinos from "@/pages/MeusTreinos";
import MeusPagamentos from "@/pages/MeusPagamentos";
import MinhasMedidas from "@/pages/MinhasMedidas";
import Chat from "@/pages/Chat";

// Admin Pages
import DashboardAdmin from "@/pages/DashboardAdmin";
import AdminCadastrarProfessor from "@/pages/AdminCadastrarProfessor";
import AdminProfessores from "@/pages/AdminProfessores";
import AdminPlanosProfessores from "@/pages/AdminPlanosProfessores";

// 404
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Professor Routes */}
              <Route path="/dashboard-professor" element={<DashboardProfessor />} />
              <Route path="/cadastrar-aluno" element={<CadastrarAluno />} />
              <Route path="/editar-aluno/:id" element={<EditarAluno />} />
              <Route path="/gerenciar-alunos" element={<GerenciarAlunos />} />
              <Route path="/listar-alunos" element={<ListarAlunos />} />
              <Route path="/cadastrar-treino" element={<CadastrarTreino />} />
              <Route path="/gerenciar-ficha-treino" element={<GerenciarFichaTreino />} />
              <Route path="/ficha-treino/:alunoId" element={<FichaTreino />} />
              <Route path="/novo-agendamento" element={<NovoAgendamento />} />
              <Route path="/gerenciar-agendamentos" element={<GerenciarAgendamentos />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/cadastrar-pagamento" element={<CadastrarPagamento />} />
              <Route path="/editar-pagamento/:id" element={<EditarPagamento />} />
              <Route path="/gerenciar-pagamentos" element={<GerenciarPagamentos />} />
              <Route path="/chat-professor" element={<ChatProfessor />} />
              <Route path="/configuracoes-professor" element={<ConfiguracoesProfessor />} />
              <Route path="/fotos-aluno/:alunoId" element={<GerenciarFotosAluno />} />
              <Route path="/historico-medidas/:alunoId" element={<HistoricoMedidasAluno />} />

              {/* Aluno Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meus-treinos" element={<MeusTreinos />} />
              <Route path="/meus-pagamentos" element={<MeusPagamentos />} />
              <Route path="/minhas-medidas" element={<MinhasMedidas />} />
              <Route path="/chat" element={<Chat />} />

              {/* Admin Routes */}
              <Route path="/dashboard-admin" element={<DashboardAdmin />} />
              <Route path="/admin/cadastrar-professor" element={<AdminCadastrarProfessor />} />
              <Route path="/admin/professores" element={<AdminProfessores />} />
              <Route path="/admin/planos-professores" element={<AdminPlanosProfessores />} />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
