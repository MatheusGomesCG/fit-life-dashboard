
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardProfessor from "./pages/DashboardProfessor";
import CadastrarProfessor from "./pages/CadastrarProfessor";
import CadastrarAluno from "./pages/CadastrarAluno";
import GerenciarAlunos from "./pages/GerenciarAlunos";
import ListarAlunos from "./pages/ListarAlunos";
import EditarAluno from "./pages/EditarAluno";
import FichaTreino from "./pages/FichaTreino";
import CadastrarTreino from "./pages/CadastrarTreino";
import GerenciarFichaTreino from "./pages/GerenciarFichaTreino";
import GerenciarPagamentos from "./pages/GerenciarPagamentos";
import CadastrarPagamento from "./pages/CadastrarPagamento";
import EditarPagamento from "./pages/EditarPagamento";
import GerenciarAgendamentos from "./pages/GerenciarAgendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import MeusTreinos from "./pages/MeusTreinos";
import MinhasMedidas from "./pages/MinhasMedidas";
import MeusPagamentos from "./pages/MeusPagamentos";
import Agendamento from "./pages/Agendamento";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import GerenciarFotosAluno from "@/pages/GerenciarFotosAluno";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="cadastrar-professor" element={<CadastrarProfessor />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard-professor" element={<DashboardProfessor />} />
            <Route path="gerenciar-alunos" element={<GerenciarAlunos />} />
            <Route path="cadastrar-aluno" element={<CadastrarAluno />} />
            <Route path="editar-aluno/:id" element={<EditarAluno />} />
            <Route path="gerenciar-fichas" element={<GerenciarFichaTreino />} />
            <Route path="ficha-treino/:id" element={<FichaTreino />} />
            <Route path="cadastrar-treino/:id" element={<CadastrarTreino />} />
            <Route path="listar-alunos" element={<ListarAlunos />} />
            <Route path="gerenciar-pagamentos" element={<GerenciarPagamentos />} />
            <Route path="cadastrar-pagamento" element={<CadastrarPagamento />} />
            <Route path="editar-pagamento/:id" element={<EditarPagamento />} />
            <Route path="agendamentos" element={<GerenciarAgendamentos />} />
            <Route path="novo-agendamento" element={<NovoAgendamento />} />
            <Route path="meus-treinos" element={<MeusTreinos />} />
            <Route path="minhas-medidas" element={<MinhasMedidas />} />
            <Route path="meus-pagamentos" element={<MeusPagamentos />} />
            <Route path="agendamento" element={<Agendamento />} />
            <Route path="chat" element={<Chat />} />
            <Route path="fotos-aluno/:id" element={<GerenciarFotosAluno />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
