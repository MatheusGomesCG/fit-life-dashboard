
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "sonner";
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastrarPagamento from './pages/CadastrarPagamento';
import EditarPagamento from './pages/EditarPagamento';
import CadastrarAluno from './pages/CadastrarAluno';
import EditarAluno from './pages/EditarAluno';
import CadastrarProfessor from "@/pages/CadastrarProfessor";
import AdminTokens from "@/pages/AdminTokens";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pagamentos/cadastrar" element={<CadastrarPagamento />} />
              <Route path="/pagamentos/editar/:id" element={<EditarPagamento />} />
              <Route path="/alunos/cadastrar" element={<CadastrarAluno />} />
              <Route path="/alunos/editar/:id" element={<EditarAluno />} />
              <Route path="/cadastrar-professor/:token" element={<CadastrarProfessor />} />
              <Route path="/admin/tokens" element={<AdminTokens />} />
            </Routes>
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
