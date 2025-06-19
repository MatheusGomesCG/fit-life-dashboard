
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardAdmin from "./pages/DashboardAdmin";
import CadastrarAluno from "./pages/CadastrarAluno";
import ListarAlunos from "./pages/ListarAlunos";
import EditarAluno from "./pages/EditarAluno";
import GerenciarAlunos from "./pages/GerenciarAlunos";
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-professor" element={<DashboardProfessor />} />
              <Route path="/dashboard-admin" element={<DashboardAdmin />} />
              <Route path="/cadastrar-aluno" element={<CadastrarAluno />} />
              <Route path="/listar-alunos" element={<ListarAlunos />} />
              <Route path="/editar-aluno/:id" element={<EditarAluno />} />
              <Route path="/gerenciar-alunos" element={<GerenciarAlunos />} />
              <Route path="/cadastrar-treino/:alunoId" element={<CadastrarTreino />} />
              <Route path="/ficha-treino" element={<FichaTreino />} />
              <Route path="/gerenciar-ficha-treino/:alunoId" element={<GerenciarFichaTreino />} />
              <Route path="/meus-treinos" element={<MeusTreinos />} />
              <Route path="/novo-agendamento" element={<NovoAgendamento />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/gerenciar-agendamentos" element={<GerenciarAgendamentos />} />
              <Route path="/cadastrar-pagamento/:alunoId" element={<CadastrarPagamento />} />
              <Route path="/editar-pagamento/:id" element={<EditarPagamento />} />
              <Route path="/gerenciar-pagamentos" element={<GerenciarPagamentos />} />
              <Route path="/meus-pagamentos" element={<MeusPagamentos />} />
              <Route path="/historico-geral" element={<HistoricoGeral />} />
              <Route path="/minhas-medidas" element={<MinhasMedidas />} />
              <Route path="/historico-medidas/:alunoId" element={<HistoricoMedidasAluno />} />
              <Route path="/cadastrar-medidas/:alunoId" element={<CadastrarMedidas />} />
              <Route path="/editar-avaliacao/:alunoId/:avaliacaoId" element={<EditarAvaliacao />} />
              <Route path="/gerenciar-fotos/:alunoId" element={<GerenciarFotosAluno />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat-professor" element={<ChatProfessor />} />
              <Route path="/configuracoes" element={<ConfiguracoesProfessor />} />
              <Route path="/admin/professores" element={<AdminProfessores />} />
              <Route path="/admin/cadastrar-professor" element={<AdminCadastrarProfessor />} />
              <Route path="/admin/planos" element={<AdminPlanosProfessores />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
