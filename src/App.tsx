import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
import GerenciarFichaTreino from "./pages/GerenciarFichaTreino";
import GerenciarPagamentos from "./pages/GerenciarPagamentos";
import CadastrarPagamento from "./pages/CadastrarPagamento";
import EditarPagamento from "./pages/EditarPagamento";
import GerenciarAgendamentos from "./pages/GerenciarAgendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import MeusTreinos from "./pages/MeusTreinos";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import GerenciarFotosAluno from "@/pages/GerenciarFotosAluno";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/cadastrar-professor",
        element: <CadastrarProfessor />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/dashboard-professor",
        element: <DashboardProfessor />
      },
      {
        path: "/gerenciar-alunos",
        element: <GerenciarAlunos />
      },
      {
        path: "/cadastrar-aluno",
        element: <CadastrarAluno />
      },
      {
        path: "/editar-aluno/:id",
        element: <EditarAluno />
      },
      {
        path: "/gerenciar-fichas",
        element: <GerenciarFichaTreino />
      },
      {
        path: "/ficha-treino/:id",
        element: <FichaTreino />
      },
      {
        path: "/cadastrar-treino/:id",
        element: <CadastrarTreino />
      },
      {
        path: "/listar-alunos",
        element: <ListarAlunos />
      },
      {
        path: "/gerenciar-pagamentos",
        element: <GerenciarPagamentos />
      },
      {
        path: "/cadastrar-pagamento",
        element: <CadastrarPagamento />
      },
      {
        path: "/editar-pagamento/:id",
        element: <EditarPagamento />
      },
      {
        path: "/agendamentos",
        element: <GerenciarAgendamentos />
      },
      {
        path: "/novo-agendamento",
        element: <NovoAgendamento />
      },
      {
        path: "/meus-treinos",
        element: <MeusTreinos />
      },
      {
        path: "/fotos-aluno/:id",
        element: <GerenciarFotosAluno />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
