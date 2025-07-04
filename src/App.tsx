import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardAdmin from "./pages/DashboardAdmin";
import CadastrarAluno from "./pages/CadastrarAluno";
import ListarAlunos from "./pages/ListarAlunos";
import EditarAluno from "./pages/EditarAluno";
import GerenciarAlunos from "./pages/GerenciarAlunos";
import NovoTreino from "./pages/NovoTreino";
import CadastrarTreino from "./pages/CadastrarTreino";
import FichaTreino from "./pages/FichaTreino";
import GerenciarFichaTreino from "./pages/GerenciarFichaTreino";
import MeusTreinos from "./pages/MeusTreinos";
import NovoAgendamento from "./pages/NovoAgendamento";
import Agendamento from "./pages/Agendamento";
import GerenciarAgendamentos from "./pages/GerenciarAgendamentos";
import CadastrarPagamento from "./pages/CadastrarPagamento";
import EditarPagamento from "./pages/EditarPagamento";
import GerenciarPagamentos from "./pages/GerenciarPagamentos";
import MeusPagamentos from "./pages/MeusPagamentos";
import HistoricoGeral from "./pages/HistoricoGeral";
import MinhasMedidas from "./pages/MinhasMedidas";
import HistoricoMedidasAluno from "./pages/HistoricoMedidasAluno";
import CadastrarMedidas from "./pages/CadastrarMedidas";
import EditarAvaliacao from "./pages/EditarAvaliacao";
import GerenciarFotosAluno from "./pages/GerenciarFotosAluno";
import Chat from "./pages/Chat";
import ChatProfessor from "./pages/ChatProfessor";
import ConfiguracoesProfessor from "./pages/ConfiguracoesProfessor";
import AdminProfessores from "./pages/AdminProfessores";
import AdminCadastrarProfessor from "./pages/AdminCadastrarProfessor";
import AdminPlanosProfessores from "./pages/AdminPlanosProfessores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/dashboard-professor" element={<Layout><DashboardProfessor /></Layout>} />
              <Route path="/dashboard-admin" element={<Layout><DashboardAdmin /></Layout>} />
              <Route path="/cadastrar-aluno" element={<Layout><CadastrarAluno /></Layout>} />
              <Route path="/listar-alunos" element={<Layout><ListarAlunos /></Layout>} />
              <Route path="/editar-aluno/:id" element={<Layout><EditarAluno /></Layout>} />
              <Route path="/gerenciar-alunos" element={<Layout><GerenciarAlunos /></Layout>} />
              <Route path="/novo-treino" element={<Layout><NovoTreino /></Layout>} />
              <Route path="/cadastrar-treino/:alunoId" element={<Layout><CadastrarTreino /></Layout>} />
              <Route path="/ficha-treino" element={<Layout><FichaTreino /></Layout>} />
              <Route path="/gerenciar-ficha-treino/:alunoId" element={<Layout><GerenciarFichaTreino /></Layout>} />
              <Route path="/meus-treinos" element={<Layout><MeusTreinos /></Layout>} />
              <Route path="/novo-agendamento" element={<Layout><NovoAgendamento /></Layout>} />
              <Route path="/agendamento" element={<Layout><Agendamento /></Layout>} />
              <Route path="/gerenciar-agendamentos" element={<Layout><GerenciarAgendamentos /></Layout>} />
              <Route path="/cadastrar-pagamento/:alunoId" element={<Layout><CadastrarPagamento /></Layout>} />
              <Route path="/editar-pagamento/:id" element={<Layout><EditarPagamento /></Layout>} />
              <Route path="/gerenciar-pagamentos" element={<Layout><GerenciarPagamentos /></Layout>} />
              <Route path="/meus-pagamentos" element={<Layout><MeusPagamentos /></Layout>} />
              <Route path="/historico-geral" element={<Layout><HistoricoGeral /></Layout>} />
              <Route path="/minhas-medidas" element={<Layout><MinhasMedidas /></Layout>} />
              <Route path="/historico-medidas/:alunoId" element={<Layout><HistoricoMedidasAluno /></Layout>} />
              <Route path="/cadastrar-medidas/:alunoId" element={<Layout><CadastrarMedidas /></Layout>} />
              <Route path="/editar-avaliacao/:alunoId/:avaliacaoId" element={<Layout><EditarAvaliacao /></Layout>} />
              <Route path="/gerenciar-fotos/:alunoId" element={<Layout><GerenciarFotosAluno /></Layout>} />
              <Route path="/chat" element={<Layout><Chat /></Layout>} />
              <Route path="/chat-professor" element={<Layout><ChatProfessor /></Layout>} />
              <Route path="/configuracoes" element={<Layout><ConfiguracoesProfessor /></Layout>} />
              <Route path="/configuracoes-professor" element={<Layout><ConfiguracoesProfessor /></Layout>} />
              <Route path="/admin/professores" element={<Layout><AdminProfessores /></Layout>} />
              <Route path="/admin/cadastrar-professor" element={<Layout><AdminCadastrarProfessor /></Layout>} />
              <Route path="/admin/planos" element={<Layout><AdminPlanosProfessores /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
