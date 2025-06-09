import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import {
  listarAlunos,
  excluirAluno,
  Aluno,
} from "@/services/alunosService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash, UserPlus, Search, FileText, Camera } from "lucide-react";

const GerenciarAlunos: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alunoToDelete, setAlunoToDelete] = useState<string | null>(null);

  const carregarAlunos = async () => {
    try {
      console.log("🚀 [GerenciarAlunos] Iniciando carregamento de alunos", {
        isAuthenticated,
        userType: user?.tipo,
        authLoading
      });
      
      setIsLoading(true);
      const data = await listarAlunos();
      setAlunos(data);
      console.log("✅ [GerenciarAlunos] Alunos carregados:", data.length);
    } catch (error) {
      console.error("❌ [GerenciarAlunos] Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar lista de alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 [GerenciarAlunos] useEffect executado", {
      authLoading,
      isAuthenticated,
      userType: user?.tipo
    });

    // Só carrega os alunos se:
    // 1. A autenticação não está carregando
    // 2. O usuário está autenticado
    // 3. O usuário é um professor
    if (!authLoading && isAuthenticated && user?.tipo === "professor") {
      console.log("✅ [GerenciarAlunos] Condições atendidas, carregando alunos");
      carregarAlunos();
    } else if (!authLoading && (!isAuthenticated || user?.tipo !== "professor")) {
      console.log("❌ [GerenciarAlunos] Usuário não é professor ou não autenticado");
      setIsLoading(false);
      // Se não é professor, redirecionar
      if (user?.tipo !== "professor") {
        toast.error("Acesso negado. Apenas professores podem gerenciar alunos.");
        navigate("/");
      }
    }
  }, [authLoading, isAuthenticated, user?.tipo, navigate]);

  const handleEdit = (id: string) => {
    navigate(`/editar-aluno/${id}`);
  };

  const handleDelete = (id: string) => {
    setAlunoToDelete(id);
  };

  const confirmDelete = async () => {
    if (alunoToDelete) {
      try {
        await excluirAluno(alunoToDelete);
        toast.success("Aluno excluído com sucesso!");
        carregarAlunos();
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        toast.error("Erro ao excluir aluno.");
      } finally {
        setAlunoToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setAlunoToDelete(null);
  };

  const navegarParaFicha = (alunoId: string) => {
    navigate(`/ficha-treino/${alunoId}`);
  };

  // Mostrar loading se ainda está autenticando ou carregando dados
  if (authLoading || (isAuthenticated && user?.tipo === "professor" && isLoading)) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Se não é professor, mostrar mensagem de acesso negado
  if (!isAuthenticated || user?.tipo !== "professor") {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Acesso restrito a professores.</p>
      </div>
    );
  }

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600 mt-1">
            Visualize, edite ou exclua alunos cadastrados
          </p>
        </div>
        <Button
          onClick={() => navigate("/cadastrar-aluno")}
          className="flex items-center gap-2 bg-fitness-primary text-white rounded-md hover:bg-fitness-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <div className="mb-4 flex items-center relative">
          <Search className="h-5 w-5 absolute left-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome do aluno..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {alunosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {alunos.length === 0 ? "Nenhum aluno cadastrado ainda." : "Nenhum aluno encontrado."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosFiltrados.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.email}</TableCell>
                    <TableCell>{aluno.telefone}</TableCell>
                    <TableCell>{aluno.idade} anos</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(aluno.id!)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Editar aluno"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navegarParaFicha(aluno.id!)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Ficha de treino"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/fotos-aluno/${aluno.id}`)}
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          title="Gerenciar fotos"
                        >
                          <Camera className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(aluno.id!)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Excluir aluno"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={alunoToDelete !== null} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá excluir o aluno permanentemente. Tem certeza que
              deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GerenciarAlunos;
