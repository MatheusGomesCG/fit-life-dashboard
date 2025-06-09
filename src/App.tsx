
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
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Rotas protegidas para professores */}
                  <Route path="/dashboard-professor" element={
                    <ProtectedRoute>
                      <DashboardProfessor />
                    </ProtectedRoute>
                  } />
                  <Route path="/cadastrar-aluno" element={
                    <ProtectedRoute>
                      <CadastrarAluno />
                    </ProtectedRoute>
                  } />
                  <Route path="/gerenciar-alunos" element={
                    <ProtectedRoute>
                      <GerenciarAlunos />
                    </ProtectedRoute>
                  } />
                  <Route path="/editar-aluno/:id" element={
                    <ProtectedRoute>
                      <EditarAluno />
                    </ProtectedRoute>
                  } />
                  <Route path="/cadastrar-treino" element={
                    <ProtectedRoute>
                      <CadastrarTreino />
                    </ProtectedRoute>
                  } />
                  <Route path="/cadastrar-treino/:alunoId" element={
                    <ProtectedRoute>
                      <CadastrarTreino />
                    </ProtectedRoute>
                  } />
                  <Route path="/ficha-treino/:alunoId" element={
                    <ProtectedRoute>
                      <FichaTreino />
                    </ProtectedRoute>
                  } />
                  <Route path="/gerenciar-ficha-treino" element={
                    <ProtectedRoute>
                      <GerenciarFichaTreino />
                    </ProtectedRoute>
                  } />
                  <Route path="/cadastrar-pagamento" element={
                    <ProtectedRoute>
                      <CadastrarPagamento />
                    </ProtectedRoute>
                  } />
                  <Route path="/gerenciar-pagamentos" element={
                    <ProtectedRoute>
                      <GerenciarPagamentos />
                    </ProtectedRoute>
                  } />
                  <Route path="/editar-pagamento/:id" element={
                    <ProtectedRoute>
                      <EditarPagamento />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat-professor" element={
                    <ProtectedRoute>
                      <ChatProfessor />
                    </ProtectedRoute>
                  } />
                  <Route path="/agendamento" element={
                    <ProtectedRoute>
                      <Agendamento />
                    </ProtectedRoute>
                  } />
                  <Route path="/gerenciar-agendamentos" element={
                    <ProtectedRoute>
                      <GerenciarAgendamentos />
                    </ProtectedRoute>
                  } />
                  <Route path="/novo-agendamento" element={
                    <ProtectedRoute>
                      <NovoAgendamento />
                    </ProtectedRoute>
                  } />
                  <Route path="/fotos-aluno/:alunoId" element={
                    <ProtectedRoute>
                      <GerenciarFotosAluno />
                    </ProtectedRoute>
                  } />
                  <Route path="/listar-alunos" element={
                    <ProtectedRoute>
                      <ListarAlunos />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </div>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
