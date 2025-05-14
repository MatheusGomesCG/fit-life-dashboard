
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  listarAlunos,
  Aluno,
  buscarFichaTreinoAluno
} from "@/services/alunosService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  PlusCircle,
  Search,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

const GerenciarFichaTreino: React.FC = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [fichasStatus, setFichasStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const alunosData = await listarAlunos();
      setAlunos(alunosData);
      
      // Verificar quais alunos já têm ficha de treino
      const statusFichas: Record<string, boolean> = {};
      for (const aluno of alunosData) {
        try {
          const temFicha = await buscarFichaTreinoAluno(aluno.id);
          statusFichas[aluno.id] = !!temFicha;
        } catch (error) {
          statusFichas[aluno.id] = false;
        }
      }
      setFichasStatus(statusFichas);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de alunos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const navegarParaFicha = (alunoId: string) => {
    navigate(`/ficha-treino/${alunoId}`);
  };

  const navegarParaCadastrarFicha = (alunoId: string) => {
    navigate(`/cadastrar-treino/${alunoId}`);
  };
  
  const navegarParaEditarFicha = (alunoId: string) => {
    navigate(`/cadastrar-treino/${alunoId}`);
  };

  // Filtra os alunos com base no campo de busca
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Fichas de Treino</h1>
          <p className="text-gray-600 mt-1">
            Visualize, edite ou crie novas fichas de treino para seus alunos
          </p>
        </div>
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

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="large" />
          </div>
        ) : alunosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum aluno encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>IMC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosFiltrados.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.idade} anos</TableCell>
                    <TableCell>{aluno.imc?.toFixed(2) || "-"}</TableCell>
                    <TableCell>
                      {fichasStatus[aluno.id] ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Ficha criada
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Sem ficha
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {fichasStatus[aluno.id] ? (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => navegarParaFicha(aluno.id)}
                            className="flex gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Ver Ficha</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => navegarParaEditarFicha(aluno.id)}
                            className="flex gap-1 text-green-600 hover:text-green-800 hover:bg-green-50"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>Editar Ficha</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => navegarParaCadastrarFicha(aluno.id)}
                          className="flex gap-1 text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Criar Ficha</span>
                        </Button>
                      )}
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

export default GerenciarFichaTreino;
