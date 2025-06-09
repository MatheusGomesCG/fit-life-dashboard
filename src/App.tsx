
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DashboardProfessor from "@/pages/DashboardProfessor";
import GerenciarAlunos from "@/pages/GerenciarAlunos";
import CadastrarAluno from "@/pages/CadastrarAluno";
import EditarAluno from "@/pages/EditarAluno";
import ListarAlunos from "@/pages/ListarAlunos";
import CadastrarTreino from "@/pages/CadastrarTreino";
import GerenciarFichaTreino from "@/pages/GerenciarFichaTreino";
import MeusTreinos from "@/pages/MeusTreinos";
import FichaTreino from "@/pages/FichaTreino";
import NovoAgendamento from "@/pages/NovoAgendamento";
import GerenciarAgendamentos from "@/pages/GerenciarAgendamentos";
import Agendamento from "@/pages/Agendamento";
import CadastrarPagamento from "@/pages/CadastrarPagamento";
import EditarPagamento from "@/pages/EditarPagamento";
import GerenciarPagamentos from "@/pages/GerenciarPagamentos";
import MeusPagamentos from "@/pages/MeusPagamentos";
import ChatProfessor from "@/pages/ChatProfessor";
import Chat from "@/pages/Chat";
import GerenciarFotosAluno from "@/pages/GerenciarFotosAluno";
import MinhasMedidas from "@/pages/MinhasMedidas";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/dashboard-professor"
              element={
                <Layout>
                  <DashboardProfessor />
                </Layout>
              }
            />
            <Route
              path="/gerenciar-alunos"
              element={
                <Layout>
                  <GerenciarAlunos />
                </Layout>
              }
            />
            <Route
              path="/cadastrar-aluno"
              element={
                <Layout>
                  <CadastrarAluno />
                </Layout>
              }
            />
            <Route
              path="/editar-aluno/:id"
              element={
                <Layout>
                  <EditarAluno />
                </Layout>
              }
            />
            <Route
              path="/listar-alunos"
              element={
                <Layout>
                  <ListarAlunos />
                </Layout>
              }
            />
            <Route
              path="/cadastrar-treino"
              element={
                <Layout>
                  <CadastrarTreino />
                </Layout>
              }
            />
            <Route
              path="/gerenciar-ficha-treino"
              element={
                <Layout>
                  <GerenciarFichaTreino />
                </Layout>
              }
            />
            <Route
              path="/meus-treinos"
              element={
                <Layout>
                  <MeusTreinos />
                </Layout>
              }
            />
            <Route
              path="/ficha-treino/:id"
              element={
                <Layout>
                  <FichaTreino />
                </Layout>
              }
            />
            <Route
              path="/novo-agendamento"
              element={
                <Layout>
                  <NovoAgendamento />
                </Layout>
              }
            />
            <Route
              path="/gerenciar-agendamentos"
              element={
                <Layout>
                  <GerenciarAgendamentos />
                </Layout>
              }
            />
            <Route
              path="/agendamento"
              element={
                <Layout>
                  <Agendamento />
                </Layout>
              }
            />
            <Route
              path="/cadastrar-pagamento"
              element={
                <Layout>
                  <CadastrarPagamento />
                </Layout>
              }
            />
            <Route
              path="/editar-pagamento/:id"
              element={
                <Layout>
                  <EditarPagamento />
                </Layout>
              }
            />
            <Route
              path="/gerenciar-pagamentos"
              element={
                <Layout>
                  <GerenciarPagamentos />
                </Layout>
              }
            />
            <Route
              path="/meus-pagamentos"
              element={
                <Layout>
                  <MeusPagamentos />
                </Layout>
              }
            />
            <Route
              path="/chat-professor"
              element={
                <Layout>
                  <ChatProfessor />
                </Layout>
              }
            />
            <Route
              path="/chat"
              element={
                <Layout>
                  <Chat />
                </Layout>
              }
            />
            <Route
              path="/gerenciar-fotos-aluno/:id"
              element={
                <Layout>
                  <GerenciarFotosAluno />
                </Layout>
              }
            />
            <Route
              path="/minhas-medidas"
              element={
                <Layout>
                  <MinhasMedidas />
                </Layout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
