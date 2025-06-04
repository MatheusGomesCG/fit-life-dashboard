import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "sonner";
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient } from "react-query";

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Students from './pages/Students';
import Pagamentos from './pages/Pagamentos';
import CadastrarPagamento from './pages/CadastrarPagamento';
import EditarPagamento from './pages/EditarPagamento';
import CadastrarAluno from './pages/CadastrarAluno';
import EditarAluno from './pages/EditarAluno';
import CadastrarProfessor from "@/pages/CadastrarProfessor";

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClient>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/alunos" element={<Students />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/pagamentos/cadastrar" element={<CadastrarPagamento />} />
              <Route path="/pagamentos/editar/:id" element={<EditarPagamento />} />
              <Route path="/alunos/cadastrar" element={<CadastrarAluno />} />
              <Route path="/alunos/editar/:id" element={<EditarAluno />} />
              <Route path="/cadastrar-professor/:token" element={<CadastrarProfessor />} />
            </Routes>
          </div>
        </QueryClient>
      </AuthProvider>
    </Router>
  );
}

export default App;
