
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
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
import GerenciarPagamentos from "./pages/GerenciarPagamentos";
import CadastrarPagamento from "./pages/CadastrarPagamento";
import EditarPagamento from "./pages/EditarPagamento";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar-professor" element={<CadastrarProfessor />} />
          
          <Route path="/" element={<Layout></Layout>}>  {/* Fixed: Added children explicitly */}
            {/* Rotas para Professores e Alunos */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard-professor" element={<DashboardProfessor />} />
            
            {/* Rotas para Professores */}
            <Route path="gerenciar-alunos" element={<GerenciarAlunos />} />
            <Route path="cadastrar-aluno" element={<CadastrarAluno />} />
            <Route path="editar-aluno/:id" element={<EditarAluno />} />
            <Route path="ficha-treino/:id" element={<FichaTreino />} />
            <Route path="cadastrar-treino/:id" element={<CadastrarTreino />} />
            <Route path="listar-alunos" element={<ListarAlunos />} />
            <Route path="gerenciar-pagamentos" element={<GerenciarPagamentos />} />
            <Route path="cadastrar-pagamento" element={<CadastrarPagamento />} />
            <Route path="editar-pagamento/:id" element={<EditarPagamento />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
