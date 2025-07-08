
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import {
  listarExerciciosCadastrados,
  criarExercicioCadastrado,
  atualizarExercicioCadastrado,
  excluirExercicioCadastrado,
  ExercicioCadastrado,
} from "@/services/exerciciosCadastradosService";
import FormularioExercicio from "@/components/professor/FormularioExercicio";

const GerenciarExerciciosCadastrados: React.FC = () => {
  const { user } = useAuth();
  const [exercicios, setExercicios] = useState<ExercicioCadastrado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exercicioEditando, setExercicioEditando] = useState<ExercicioCadastrado | null>(null);

  useEffect(() => {
    carregarExercicios();
  }, [user]);

  const carregarExercicios = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await listarExerciciosCadastrados(user.id);
      setExercicios(data);
    } catch (error) {
      console.error("Erro ao carregar exercícios:", error);
      toast.error("Erro ao carregar exercícios cadastrados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarExercicio = async (dadosExercicio: Omit<ExercicioCadastrado, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (exercicioEditando) {
        await atualizarExercicioCadastrado(exercicioEditando.id, dadosExercicio);
        toast.success("Exercício atualizado com sucesso!");
      } else {
        await criarExercicioCadastrado({
          ...dadosExercicio,
          professor_id: user!.id
        });
        toast.success("Exercício cadastrado com sucesso!");
      }
      
      setDialogOpen(false);
      setExercicioEditando(null);
      carregarExercicios();
    } catch (error) {
      console.error("Erro ao salvar exercício:", error);
      toast.error("Erro ao salvar exercício. Tente novamente.");
    }
  };

  const handleExcluirExercicio = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este exercício?")) return;
    
    try {
      await excluirExercicioCadastrado(id);
      toast.success("Exercício excluído com sucesso!");
      carregarExercicios();
    } catch (error) {
      console.error("Erro ao excluir exercício:", error);
      toast.error("Erro ao excluir exercício. Tente novamente.");
    }
  };

  const exerciciosFiltrados = exercicios.filter(exercicio =>
    exercicio.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    exercicio.grupo_muscular.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exercícios Cadastrados</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus exercícios personalizados
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setExercicioEditando(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Exercício
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {exercicioEditando ? "Editar Exercício" : "Novo Exercício"}
              </DialogTitle>
            </DialogHeader>
            <FormularioExercicio
              exercicio={exercicioEditando}
              onSalvar={handleSalvarExercicio}
              onCancelar={() => {
                setDialogOpen(false);
                setExercicioEditando(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4 flex items-center relative">
          <Search className="h-5 w-5 absolute left-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome ou grupo muscular..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="large" />
          </div>
        ) : exerciciosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {filtro ? "Nenhum exercício encontrado." : "Nenhum exercício cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Grupo Muscular</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exerciciosFiltrados.map((exercicio) => (
                  <TableRow key={exercicio.id}>
                    <TableCell className="font-medium">{exercicio.nome}</TableCell>
                    <TableCell>{exercicio.grupo_muscular}</TableCell>
                    <TableCell>{exercicio.equipamento || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setExercicioEditando(exercicio);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExcluirExercicio(exercicio.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GerenciarExerciciosCadastrados;
