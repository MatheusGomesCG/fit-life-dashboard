
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DashboardProfessor from "@/pages/DashboardProfessor";
import MeusTreinos from "@/pages/MeusTreinos";
import MinhasMedidas from "@/pages/MinhasMedidas";
import MeusPagamentos from "@/pages/MeusPagamentos";
import Chat from "@/pages/Chat";
import Feed from "@/pages/Feed";
import GerenciarAlunos from "@/pages/GerenciarAlunos";
import CadastrarAluno from "@/pages/CadastrarAluno";
import EditarAluno from "@/pages/EditarAluno";
import GerenciarFichaTreino from "@/pages/GerenciarFichaTreino";
import FichaTreino from "@/pages/FichaTreino";
import CadastrarTreino from "@/pages/CadastrarTreino";
import GerenciarExerciciosCadastrados from "@/pages/GerenciarExerciciosCadastrados";
import CadastrarMedidas from "@/pages/CadastrarMedidas";
import HistoricoMedidasAluno from "@/pages/HistoricoMedidasAluno";
import CadastrarPagamento from "@/pages/CadastrarPagamento";
import EditarPagamento from "@/pages/EditarPagamento"; 
import GerenciarPagamentos from "@/pages/GerenciarPagamentos";
import GerenciarAgendamentos from "@/pages/GerenciarAgendamentos";
import Agendamento from "@/pages/Agendamento";
import NovoAgendamento from "@/pages/NovoAgendamento";
import ChatProfessor from "@/pages/ChatProfessor";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitness-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Use the user.tipo property directly instead of getUserRole function
  const userRole = user.tipo;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <Navigate to={
            userRole === 'professor' ? '/dashboard-professor' : '/dashboard'
          } replace />
        } />
        
        {/* Rotas do Aluno */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/meus-treinos" element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <MeusTreinos />
          </ProtectedRoute>
        } />
        <Route path="/minhas-medidas" element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <MinhasMedidas />
          </ProtectedRoute>
        } />
        <Route path="/meus-pagamentos" element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <MeusPagamentos />
          </ProtectedRoute>
        } />
        <Route path="/agendamento" element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <Agendamento />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <Chat />
          </ProtectedRoute>
        } />

        {/* Rotas do Professor */}
        <Route path="/dashboard-professor" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <DashboardProfessor />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-alunos" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <GerenciarAlunos />
          </ProtectedRoute>
        } />
        <Route path="/cadastrar-aluno" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <CadastrarAluno />
          </ProtectedRoute>
        } />
        <Route path="/editar-aluno/:alunoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <EditarAluno />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-ficha-treino" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <GerenciarFichaTreino />
          </ProtectedRoute>
        } />
        <Route path="/ficha-treino/:alunoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <FichaTreino />
          </ProtectedRoute>
        } />
        <Route path="/cadastrar-treino/:alunoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <CadastrarTreino />
          </ProtectedRoute>
        } />
        <Route path="/exercicios-cadastrados" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <GerenciarExerciciosCadastrados />
          </ProtectedRoute>
        } />
        <Route path="/cadastrar-medidas/:alunoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <CadastrarMedidas />
          </ProtectedRoute>
        } />
        <Route path="/historico-medidas/:alunoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <HistoricoMedidasAluno />
          </ProtectedRoute>
        } />
        <Route path="/cadastrar-pagamento/:alunoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <CadastrarPagamento />
          </ProtectedRoute>
        } />
        <Route path="/editar-pagamento/:pagamentoId" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <EditarPagamento />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-pagamentos" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <GerenciarPagamentos />
          </ProtectedRoute>
        } />
        <Route path="/gerenciar-agendamentos" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <GerenciarAgendamentos />
          </ProtectedRoute>
        } />
        <Route path="/novo-agendamento" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <NovoAgendamento />
          </ProtectedRoute>
        } />
        <Route path="/chat-professor" element={
          <ProtectedRoute allowedRoles={['professor']}>
            <ChatProfessor />
          </ProtectedRoute>
        } />

        {/* Rotas Compartilhadas */}
        <Route path="/feed" element={
          <ProtectedRoute allowedRoles={['aluno', 'professor']}>
            <Feed />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
