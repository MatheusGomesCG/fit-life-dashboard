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
import { Card, CardContent } from "@/components/ui/card";
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
import { Edit, Trash, UserPlus, Search, FileText, Camera, History, User, Mail, Phone, Calendar } from "lucide-react";

const GerenciarAlunos: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alunoToDelete, setAlunoToDelete] = useState<{ id: string; nome: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    console.log("✏️ [GerenciarAlunos] Navegando para editar aluno:", id);
    navigate(`/editar-aluno/${id}`);
  };

  const handleDelete = (id: string, nome: string) => {
    setAlunoToDelete({ id, nome });
  };

  const confirmDelete = async () => {
    if (alunoToDelete) {
      setIsDeleting(true);
      try {
        console.log("🗑️ [GerenciarAlunos] Iniciando exclusão do aluno:", alunoToDelete);
        
        await excluirAluno(alunoToDelete.id);
        
        toast.success(`Aluno "${alunoToDelete.nome}" foi excluído permanentemente!`);
        
        // Recarregar a lista de alunos para refletir a exclusão
        await carregarAlunos();
        
      } catch (error) {
        console.error("❌ [GerenciarAlunos] Erro ao excluir aluno:", error);
        toast.error("Erro ao excluir aluno. Tente novamente.");
      } finally {
        setIsDeleting(false);
        setAlunoToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setAlunoToDelete(null);
  };

  const navegarParaFicha = (alunoId: string) => {
    console.log("📋 [GerenciarAlunos] Navegando para ficha de treino:", alunoId);
    navigate(`/ficha-treino/${alunoId}`);
  };

  const navegarParaFotos = (alunoId: string) => {
    console.log("🖼️ [GerenciarAlunos] Navegando para fotos do aluno:", alunoId);
    navigate(`/fotos/${alunoId}`);
  };

  const navegarParaHistoricoMedidas = (alunoId: string) => {
    console.log("📏 [GerenciarAlunos] Navegando para histórico de medidas:", alunoId);
    navigate(`/historico-medidas/${alunoId}`);
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

  const ActionButton = ({ onClick, icon: Icon, title, className }: {
    onClick: () => void;
    icon: any;
    title: string;
    className: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-colors ${className}`}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
          <>
            {/* Vista Desktop - Tabela */}
            <div className="hidden md:block overflow-x-auto">
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
                          <ActionButton
                            onClick={() => handleEdit(aluno.id!)}
                            icon={Edit}
                            title="Editar aluno"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          />
                          <ActionButton
                            onClick={() => navegarParaFicha(aluno.id!)}
                            icon={FileText}
                            title="Ficha de treino"
                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          />
                          <ActionButton
                            onClick={() => navegarParaHistoricoMedidas(aluno.id!)}
                            icon={History}
                            title="Histórico de medidas"
                            className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                          />
                          <ActionButton
                            onClick={() => navegarParaFotos(aluno.id!)}
                            icon={Camera}
                            title="Gerenciar fotos"
                            className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                          />
                          <ActionButton
                            onClick={() => handleDelete(aluno.id!, aluno.nome)}
                            icon={Trash}
                            title="Excluir aluno"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-4">
              {alunosFiltrados.map((aluno) => (
                <Card key={aluno.id} className="shadow-sm border border-gray-200">
                  <CardContent className="p-4">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {aluno.nome}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Aluno */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="break-all">{aluno.email}</span>
                      </div>
                      {aluno.telefone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{aluno.telefone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{aluno.idade} anos</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="border-t pt-3">
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => handleEdit(aluno.id!)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="text-xs">Editar</span>
                        </Button>
                        <Button
                          onClick={() => navegarParaFicha(aluno.id!)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-xs">Treino</span>
                        </Button>
                        <Button
                          onClick={() => navegarParaHistoricoMedidas(aluno.id!)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <History className="h-4 w-4" />
                          <span className="text-xs">Medidas</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          onClick={() => navegarParaFotos(aluno.id!)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          <Camera className="h-4 w-4" />
                          <span className="text-xs">Fotos</span>
                        </Button>
                        <Button
                          onClick={() => handleDelete(aluno.id!, aluno.nome)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="text-xs">Excluir</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Alert Dialog para confirmação de exclusão */}
      <AlertDialog open={alunoToDelete !== null} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">⚠️ Exclusão Permanente</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-medium">
                Você está prestes a excluir permanentemente o aluno "{alunoToDelete?.nome}".
              </p>
              <p className="text-sm text-gray-600">
                Esta ação irá remover:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Todas as fichas de treino</li>
                <li>Histórico de agendamentos</li>
                <li>Registros de pagamentos</li>
                <li>Conversas e mensagens</li>
                <li>Conta de acesso do aluno</li>
              </ul>
              <p className="font-medium text-red-600 mt-3">
                ⚠️ Esta ação é irreversível e não pode ser desfeita!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Excluindo..." : "Excluir Permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GerenciarAlunos;
