
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardProfessor from "./pages/DashboardProfessor";
import CadastrarAluno from "./pages/CadastrarAluno";
import GerenciarAlunos from "./pages/GerenciarAlunos";
import EditarAluno from "./pages/EditarAluno";
import CadastrarTreino from "./pages/CadastrarTreino";
import FichaTreino from "./pages/FichaTreino";
import GerenciarFichaTreino from "./pages/GerenciarFichaTreino";
import CadastrarPagamento from "./pages/CadastrarPagamento";
import GerenciarPagamentos from "./pages/GerenciarPagamentos";
import EditarPagamento from "./pages/EditarPagamento";
import ChatProfessor from "./pages/ChatProfessor";
import Agendamento from "./pages/Agendamento";
import GerenciarAgendamentos from "./pages/GerenciarAgendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import GerenciarFotosAluno from "./pages/GerenciarFotosAluno";
import ListarAlunos from "./pages/ListarAlunos";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard-professor" element={<DashboardProfessor />} />
                  <Route path="/cadastrar-aluno" element={<CadastrarAluno />} />
                  <Route path="/gerenciar-alunos" element={<GerenciarAlunos />} />
                  <Route path="/editar-aluno/:id" element={<EditarAluno />} />
                  <Route path="/cadastrar-treino" element={<CadastrarTreino />} />
                  <Route path="/cadastrar-treino/:alunoId" element={<CadastrarTreino />} />
                  <Route path="/ficha-treino/:alunoId" element={<FichaTreino />} />
                  <Route path="/gerenciar-ficha-treino" element={<GerenciarFichaTreino />} />
                  <Route path="/cadastrar-pagamento" element={<CadastrarPagamento />} />
                  <Route path="/gerenciar-pagamentos" element={<GerenciarPagamentos />} />
                  <Route path="/editar-pagamento/:id" element={<EditarPagamento />} />
                  <Route path="/chat-professor" element={<ChatProfessor />} />
                  <Route path="/agendamento" element={<Agendamento />} />
                  <Route path="/gerenciar-agendamentos" element={<GerenciarAgendamentos />} />
                  <Route path="/novo-agendamento" element={<NovoAgendamento />} />
                  <Route path="/fotos-aluno/:alunoId" element={<GerenciarFotosAluno />} />
                  <Route path="/listar-alunos" element={<ListarAlunos />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </div>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
